---
title: "Audio Plumbing"
checks:
  speaker-first:
    question: "Why do we open the speaker stream *before* sending settings?"
    options:
      - text: "So the agent's greeting audio has somewhere to land the moment the session opens."
        correct: true
        feedback: "Exactly — the greeting starts streaming as soon as `SettingsApplied` fires, and the speaker has to be ready for it."
      - text: "Speaker streams take longer to open than mic streams."
        correct: false
        feedback: "Both open at roughly the same speed — the ordering is about being ready for the greeting."
      - text: "It's an audio-library API requirement."
        correct: false
        feedback: "Neither audio library requires this order — it's about the agent lifecycle."
---

Audio bytes flow in both directions. The agent's speech comes in over the WebSocket and needs somewhere to play; your microphone audio comes in from the OS and needs to be shipped out to Deepgram.

The libraries we use to talk to the operating system differ by language:

- **Python** uses [`sounddevice`](https://python-sounddevice.readthedocs.io/), which ships PortAudio binaries inside its Python wheels — most attendees won't need to install anything system-level on macOS, Windows, or desktop Linux.
- **JavaScript** uses [`mic`](https://www.npmjs.com/package/mic) for input and [`speaker`](https://www.npmjs.com/package/speaker) for output. `mic` shells out to `sox` (macOS, Windows) or `arecord` (Linux), so those need to be installed — see the [Setup](/uc-berkeley-2026/setup#install) section.

## Open the speaker stream first {#speaker-first}

Before we even send our agent settings, we open the speaker so it's ready for the agent's greeting:

:::tabs
@tab python Python
```python
import sounddevice as sd

SAMPLE_RATE = 24000
CHANNELS = 1
DTYPE = "int16"  # linear16 == int16 PCM

speaker = sd.RawOutputStream(
    samplerate=SAMPLE_RATE,
    channels=CHANNELS,
    dtype=DTYPE,
)
speaker.start()
```

@tab javascript JavaScript
```javascript
import Speaker from "speaker";

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BIT_DEPTH = 16;

const speaker = new Speaker({
  channels:   CHANNELS,
  bitDepth:   BIT_DEPTH,
  sampleRate: SAMPLE_RATE,
  signed:     true,
});
```
:::

Inside the message handler, agent audio bytes go straight to it:

:::tabs
@tab python Python
```python
if isinstance(message, bytes):
    speaker.write(message)
    return
```

@tab javascript JavaScript
```javascript
if (Buffer.isBuffer(message)) {
  speaker.write(message);
  return;
}
```
:::

No decoding, no buffering of your own — the agent gives you bytes in your declared output format, and the speaker plays them.

## Open the mic stream after `SettingsApplied` {#mic-after-settings}

The microphone emits chunks of audio that we forward to Deepgram on every event:

:::tabs
@tab python Python
```python
def microphone_callback(indata, _frames, _time_info, _status):
    agent.send_media(bytes(indata))

microphone = sd.RawInputStream(
    samplerate=SAMPLE_RATE,
    channels=CHANNELS,
    dtype=DTYPE,
    callback=microphone_callback,
)
microphone.start()
```

@tab javascript JavaScript
```javascript
import micFactory from "mic";

const microphone = micFactory({
  rate:     String(SAMPLE_RATE),
  channels: String(CHANNELS),
  bitwidth: String(BIT_DEPTH),
  encoding: "signed-integer",
  endian:   "little",
  device:   "default",
});

const micStream = microphone.getAudioStream();
micStream.on("data", (chunk) => agent.sendMedia(chunk));

microphone.start();
```
:::

Each chunk gets shipped to Deepgram via the agent's `send_media` (Python) or `sendMedia` (JavaScript) call. The Voice Agent handles all the buffering and word-boundary detection on its side — you don't need to chunk to phrase boundaries or do any pre-processing.

We deliberately start the mic *after* `SettingsApplied` so that we're not sending audio while the agent is still configuring itself.

## Clean shutdown on Ctrl+C {#cleanup}

The whole thing runs until you press Ctrl+C. Stop both streams cleanly on shutdown:

:::tabs
@tab python Python
```python
try:
    while True:
        time.sleep(0.1)
except KeyboardInterrupt:
    print("\nShutting down...")
finally:
    microphone.stop()
    speaker.stop()
```

@tab javascript JavaScript
```javascript
const shutdown = () => {
  console.log("\nShutting down...");
  microphone.stop();
  speaker.end();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```
:::

Stopping the streams releases the underlying audio handles. Not strictly necessary on process exit, but it's a habit worth keeping — the same pattern matters a lot more when the voice agent is embedded in a longer-running application.

## Troubleshooting audio devices {#troubleshooting}

If the audio library can't find an input or output device, you'll see an error on startup. The most common causes:

- **macOS:** the terminal doesn't have microphone permission yet. Run the script once, accept the system prompt, and try again.
- **WSL:** no native audio routing. See the [WSL bridge step in Setup](/uc-berkeley-2026/setup#wsl).
- **Linux (JavaScript flow):** `sox` or `arecord` isn't installed. Run `sudo apt install -y sox alsa-utils`.
- **Headless Linux server:** there genuinely is no audio device. You'd need to pipe audio from a file or another source instead.
