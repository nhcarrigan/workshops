---
title: "Agent Settings"
checks:
  audio-format:
    question: "Why do we configure both `input` and `output` audio blocks?"
    options:
      - text: "So the agent knows what format your mic is sending and what format it should reply with."
        correct: true
        feedback: "Right — the agent transcribes the format you declare on input and synthesises in the format you declare on output."
      - text: "Because the SDK throws if `output` is missing."
        correct: false
        feedback: "The SDK accepts a settings block without `output`, but then you can't play the agent's voice back."
      - text: "To enable echo cancellation."
        correct: false
        feedback: "Echo cancellation isn't something Deepgram handles — that's a client-side OS concern."
  prompt-role:
    question: "What does the `prompt` field inside `think` actually control?"
    options:
      - text: "The agent's personality and behaviour — its instructions for every turn."
        correct: true
        feedback: "Exactly. Most of the work in shaping a real agent happens in this string."
      - text: "The text the agent says first when it connects."
        correct: false
        feedback: "That's the `greeting` field. The `prompt` is the system-level instructions sent on every turn."
      - text: "The user's transcribed speech."
        correct: false
        feedback: "The transcribed speech is sent in `ConversationText` messages — separate from the static prompt."
---

Everything about your agent's behaviour starts with a single settings object. We send it once, the agent applies it, and we're off to the races.

## Configure audio I/O {#audio-format}

The `audio` block tells Deepgram what format your microphone is sending and what format you want the agent's voice in. We use `linear16` (raw 16-bit PCM) at 24 kHz for both, which keeps the wiring trivial.

:::tabs
@tab python Python
```python
SAMPLE_RATE = 24000

audio = AgentV1SettingsAudio(
    input=AgentV1SettingsAudioInput(encoding="linear16", sample_rate=SAMPLE_RATE),
    output=AgentV1SettingsAudioOutput(encoding="linear16", sample_rate=SAMPLE_RATE),
)
```

@tab javascript JavaScript
```javascript
const SAMPLE_RATE = 24000;

const audio = {
  input:  { encoding: "linear16", sample_rate: SAMPLE_RATE },
  output: { encoding: "linear16", sample_rate: SAMPLE_RATE },
};
```
:::

You can use different sample rates and encodings if your input device or output target needs them — `mulaw` and `alaw` are common for phone-system integrations — but stick with `linear16` at 24 kHz for this workshop.

## Wire the listen / think / speak chain {#wire-providers}

The `agent` block is where you describe the three components from the overview. Each one is a separate provider configuration.

:::tabs
@tab python Python
```python
agent = AgentV1SettingsAgent(
    listen=AgentV1SettingsAgentListen(
        provider=AgentV1SettingsAgentListenProvider_V1(
            type="deepgram",
            model="nova-3",
        ),
    ),
    think=ThinkSettingsV1(
        provider=ThinkSettingsV1Provider_OpenAi(
            type="open_ai",
            model="gpt-4o-mini",
            temperature=0.7,
        ),
        prompt="You are a helpful AI assistant. Keep your responses brief.",
    ),
    speak=SpeakSettingsV1(
        provider=SpeakSettingsV1Provider_Deepgram(
            type="deepgram",
            model="aura-2-asteria-en",
        ),
    ),
    greeting="Hello! I'm a Deepgram voice agent. What would you like to talk about?",
)
```

@tab javascript JavaScript
```javascript
const agent = {
  listen: {
    provider: {
      type:  "deepgram",
      model: "nova-3",
    },
  },
  think: {
    provider: {
      type:        "open_ai",
      model:       "gpt-4o-mini",
      temperature: 0.7,
    },
    prompt: "You are a helpful AI assistant. Keep your responses brief.",
  },
  speak: {
    provider: {
      type:  "deepgram",
      model: "aura-2-asteria-en",
    },
  },
  greeting: "Hello! I'm a Deepgram voice agent. What would you like to talk about?",
};
```
:::

A few things worth calling out:

- The `listen` provider is Deepgram's `nova-3` — Deepgram's flagship streaming STT model.
- The `think` provider is OpenAI's `gpt-4o-mini`. Temperature `0.7` is conversational without going off the rails.
- The `speak` provider is `aura-2-asteria-en` — one of around fifty Aura-2 voices. We'll swap voices in a later section.

## Shape the personality with `prompt` {#prompt-role}

The `prompt` field inside `think` is where the agent's personality lives. The starter says *"You are a helpful AI assistant. Keep your responses brief."* — about as generic as it gets.

Most of the real work in building a useful voice agent happens in this string. We'll iterate on the prompt in the [Personality](/uc-berkeley-2026/personality) section.

## Greet the user with `greeting` {#greeting}

The `greeting` field is the line your agent says the moment a session opens, before the user has spoken. It's both a UX nicety and a quick way to verify audio playback is working on the user's end.

## Assemble and send the settings {#send-settings}

Wrap both blocks into a single settings object:

:::tabs
@tab python Python
```python
SETTINGS = AgentV1Settings(audio=audio, agent=agent)
```

@tab javascript JavaScript
```javascript
const SETTINGS = { type: "Settings", audio, agent };
```
:::

You'll send this object exactly once per session, right after the WebSocket opens. The agent emits a `SettingsApplied` event when it's ready for media.
