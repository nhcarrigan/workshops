---
title: "Handling Events"
checks:
  bytes-path:
    question: "What do you do when the message handler receives raw audio bytes?"
    options:
      - text: "Write them straight to the speaker output stream."
        correct: true
        feedback: "Right — raw audio bytes are the agent's synthesised voice, and they're already in your output encoding."
      - text: "Decode them as JSON first."
        correct: false
        feedback: "Audio bytes aren't JSON — only the event messages are JSON-shaped objects."
      - text: "Send them to the LLM as context."
        correct: false
        feedback: "The Voice Agent handles all the in-between routing. Your job with audio bytes is to play them."
  settings-applied:
    question: "Why do we wait for `SettingsApplied` before starting the microphone?"
    options:
      - text: "The agent isn't ready to accept media until it's confirmed our settings."
        correct: true
        feedback: "Exactly — sending mic audio before the agent is configured would either be dropped or cause an error."
      - text: "It's only an aesthetic delay — the mic would work either way."
        correct: false
        feedback: "It's a real handshake — until you see `SettingsApplied`, the agent doesn't know what audio format to expect."
      - text: "Because the mic permission prompt blocks until then."
        correct: false
        feedback: "The mic permission is unrelated. The wait is for the protocol-level handshake."
---

Every message the Voice Agent sends you flows through one callback. Some are audio bytes, some are JSON-shaped events, and your handler decides what to do with each one.

## Handle audio bytes first {#bytes-path}

The first check is the most important: if the message is raw bytes, write it to your speaker output. That's how the agent talks.

:::tabs
@tab python Python
```python
def on_message(message: AgentMessage) -> None:
    if isinstance(message, bytes):
        speaker.write(message)
        return
```

@tab javascript JavaScript
```javascript
agent.on("message", (message) => {
  if (Buffer.isBuffer(message)) {
    speaker.write(message);
    return;
  }
  // ...JSON event handling below
});
```
:::

The bytes are already in the encoding you declared in `audio.output`, so you can feed them straight to the speaker output stream without any decoding step.

## Dispatch on `type` {#dispatch}

For non-byte messages, the `type` field tells you which event you're looking at. The handler covers all the common ones:

:::tabs
@tab python Python
```python
message_type = getattr(message, "type", "Unknown")

if message_type == "SettingsApplied":
    print(">> Settings applied")
    settings_applied.set()
elif message_type == "ConversationText":
    role = getattr(message, "role", "unknown")
    content = getattr(message, "content", "")
    print(f"[{role}] {content}")
elif message_type == "UserStartedSpeaking":
    print(">> User started speaking")
elif message_type == "AgentThinking":
    print(">> Agent thinking...")
elif message_type == "AgentStartedSpeaking":
    print(">> Agent started speaking")
elif message_type == "AgentAudioDone":
    print(">> Agent finished speaking")
elif message_type == "Error":
    code = getattr(message, "code", "unknown")
    description = getattr(message, "description", "unknown error")
    print(f">> Agent error: {code} - {description}")
else:
    print(f">> {message_type}")
```

@tab javascript JavaScript
```javascript
switch (message.type) {
  case "SettingsApplied":
    console.log(">> Settings applied");
    resolveSettingsApplied();
    break;
  case "ConversationText":
    console.log(`[${message.role ?? "unknown"}] ${message.content ?? ""}`);
    break;
  case "UserStartedSpeaking":
    console.log(">> User started speaking");
    break;
  case "AgentThinking":
    console.log(">> Agent thinking...");
    break;
  case "AgentStartedSpeaking":
    console.log(">> Agent started speaking");
    break;
  case "AgentAudioDone":
    console.log(">> Agent finished speaking");
    break;
  case "Error":
    console.log(`>> Agent error: ${message.code ?? "unknown"} - ${message.description ?? "unknown error"}`);
    break;
  default:
    console.log(`>> ${message.type}`);
}
```
:::

## Synchronise on `SettingsApplied` {#settings-applied}

The `SettingsApplied` event is the handshake that tells you the agent has acknowledged your config and is ready to accept media. Before that, sending mic audio is a no-op at best and an error at worst.

:::tabs
@tab python Python
We use a `threading.Event` so the main thread can wait for the handshake before opening the microphone:

```python
settings_applied = threading.Event()

# Inside on_message:
if message_type == "SettingsApplied":
    settings_applied.set()

# Later, after sending settings:
if not settings_applied.wait(10):
    raise TimeoutError("Timed out waiting for agent settings to apply.")
```

@tab javascript JavaScript
We use a manually-resolved `Promise` so the main flow can `await` the handshake before opening the microphone:

```javascript
let resolveSettingsApplied;
const settingsApplied = new Promise((resolve) => {
  resolveSettingsApplied = resolve;
});

// Inside the message handler:
if (message.type === "SettingsApplied") {
  resolveSettingsApplied();
}

// Later, after sending settings:
const settingsTimeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Timed out waiting for agent settings to apply.")), 10000);
});
await Promise.race([settingsApplied, settingsTimeout]);
```
:::

## Useful events for UI and observability {#other-events}

The remaining events aren't required for the agent to function, but they're useful for everything else you might build around it:

- `ConversationText` carries the transcribed speech — both yours (with `role: user`) and the agent's reply (with `role: assistant`). This is what you'd log to a database, push to a frontend transcript pane, or feed to analytics.
- `UserStartedSpeaking` fires the moment the agent detects you began speaking. Useful for "user is interrupting" UI cues, though the Voice Agent handles the actual interrupt routing for you internally.
- `AgentThinking`, `AgentStartedSpeaking`, `AgentAudioDone` are progress markers around the agent's own turn. Pair them with a UI indicator to show users when the agent is "listening" vs. "thinking" vs. "speaking".
- `Error` and the various `*Updated` events you can extend the handler to react to as your agent gets fancier.
