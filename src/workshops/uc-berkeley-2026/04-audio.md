---
title: "Audio Plumbing"
checks:
  sounddevice-portable:
    question: "Why does `sounddevice` work cross-platform without extra installs in most cases?"
    options:
      - text: "It ships PortAudio binaries inside its Python wheels for Linux, macOS, and Windows."
        correct: true
        feedback: "Right — the wheel bundles PortAudio, so attendees don't need apt/brew/choco gymnastics."
      - text: "It uses the OS's WebRTC stack."
        correct: false
        feedback: "sounddevice talks to PortAudio, not WebRTC."
      - text: "It falls back to a file-based audio simulator if no device is found."
        correct: false
        feedback: "There's no simulator fallback — if PortAudio can't see an audio device, you get an error."
  speaker-first:
    question: "Why do we open the speaker stream *before* sending settings?"
    options:
      - text: "So the agent's greeting audio has somewhere to land the moment the session opens."
        correct: true
        feedback: "Exactly — the greeting starts streaming as soon as `SettingsApplied` fires, and the speaker has to be ready for it."
      - text: "Speaker streams take longer to open than mic streams."
        correct: false
        feedback: "Both open at roughly the same speed — the ordering is about being ready for the greeting."
      - text: "It's a `sounddevice` API requirement."
        correct: false
        feedback: "sounddevice doesn't require this order — it's about the agent lifecycle."
---

Audio bytes flow in both directions. The agent's speech comes in over the WebSocket and needs somewhere to play; your microphone audio comes in from the OS and needs to be shipped out to Deepgram.

We use the [`sounddevice`](https://python-sounddevice.readthedocs.io/) package because it ships PortAudio binaries in its Python wheels, which means most attendees won't need to install anything system-level on macOS, Windows, or desktop Linux.

## Open the speaker stream first {#speaker-first}

Before we even send our agent settings, we open a `RawOutputStream` so the speaker is ready for the agent's greeting:

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

Inside `on_message`, agent audio bytes go straight to it:

```python
if isinstance(message, bytes):
    speaker.write(message)
    return
```

No decoding, no buffering of your own — the agent gives you bytes in your declared output format, and the speaker plays them.

## Open the mic stream after `SettingsApplied` {#mic-after-settings}

The microphone uses a callback that fires on every captured chunk:

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

Each chunk gets shipped to Deepgram via `agent.send_media(bytes(indata))`. The Voice Agent handles all the buffering and word-boundary detection on its side — you don't need to chunk to phrase boundaries or do any pre-processing.

We deliberately start the mic *after* `SettingsApplied` so that we're not sending audio while the agent is still configuring itself.

## Clean shutdown on Ctrl+C {#cleanup}

The whole thing runs until you press Ctrl+C. Wrap the main loop in a `try/finally` so both streams stop cleanly:

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

Stopping the streams releases the underlying PortAudio handles. Not strictly necessary on process exit, but it's a habit worth keeping — the same pattern matters a lot more when the voice agent is embedded in a longer-running application.

## Troubleshooting audio devices {#troubleshooting}

If `sounddevice` can't find an input or output device, you'll see a `PortAudioError: Error querying device -1` on startup. The most common causes:

- **macOS:** the terminal doesn't have microphone permission yet. Run the script once, accept the system prompt, and try again.
- **WSL:** no native audio routing. See the [WSL bridge step in Setup](/uc-berkeley-2026/setup#wsl).
- **Headless Linux server:** there genuinely is no audio device. You'd need to pipe audio from a file or another source instead of using `sounddevice`.
