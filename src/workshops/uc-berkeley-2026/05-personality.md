---
title: "Personality"
checks:
  prompt-is-personality:
    question: "Where does your agent's personality live?"
    options:
      - text: "In the `prompt` field inside `think`."
        correct: true
        feedback: "Right — this single string is the agent's instructions for every turn."
      - text: "In the `greeting` field."
        correct: false
        feedback: "The greeting is just the first line — the prompt is the ongoing instructions."
      - text: "In a separate `persona` field the SDK exposes."
        correct: false
        feedback: "There isn't a separate persona field — everything is in the prompt."
  iterate-quickly:
    question: "What's the fastest way to evaluate a prompt change?"
    options:
      - text: "Restart the script, say the same handful of test phrases, listen to how the agent responds."
        correct: true
        feedback: "Right — iteration is the whole game. Pick a few representative inputs and run them every time."
      - text: "Run a full evaluation suite against an LLM-as-judge harness."
        correct: false
        feedback: "You'll get there eventually for production agents, but for workshop iteration the human-in-the-loop test loop is enough."
      - text: "Read the new prompt back to yourself and trust your gut."
        correct: false
        feedback: "Voice agents behave in surprising ways. Always test the actual behaviour, not what you imagine the behaviour will be."
---

The bare-minimum prompt — *"You are a helpful AI assistant. Keep your responses brief."* — is fine, but it's also boring. Most of the work in building a real voice agent is iterating on this single string until the agent behaves the way you want.

## The prompt *is* the agent {#prompt-is-personality}

The system prompt is the only piece of context the LLM has about who it is and what it's doing. It's sent on every turn, ahead of the conversation transcript.

A useful prompt usually covers four things:

1. **Who the agent is** — a name, a role, a brief identity.
2. **What it's there to do** — its goal in this session.
3. **How it should behave** — tone, length, when to ask clarifying questions.
4. **What it should *not* do** — out-of-scope topics, things to defer to a human, anything you don't want it inventing.

## Try a richer prompt {#try-it}

Replace the `prompt` value in your settings with something that has more shape. Here's an example that turns your agent into a Socratic developer mentor:

:::tabs
@tab python Python
```python
prompt = (
    "Your name is Rose, and you are here to help the developer "
    "begin building with Deepgram's products. You should be "
    "helpful and encouraging, but do not simply give the answers. "
    "Leverage the Socratic method to guide them through their own "
    "cognitive reasoning."
)
```

@tab javascript JavaScript
```javascript
const prompt =
  "Your name is Rose, and you are here to help the developer " +
  "begin building with Deepgram's products. You should be " +
  "helpful and encouraging, but do not simply give the answers. " +
  "Leverage the Socratic method to guide them through their own " +
  "cognitive reasoning.";
```
:::

Update the `greeting` to match the new identity:

:::tabs
@tab python Python
```python
greeting = "Hello! I'm Rose, your mentor for all things Deepgram. What can I help you build today?"
```

@tab javascript JavaScript
```javascript
const greeting = "Hello! I'm Rose, your mentor for all things Deepgram. What can I help you build today?";
```
:::

Restart the agent and have a conversation with it. Notice that even though the underlying LLM hasn't changed, the *agent* feels completely different.

## Iterate quickly {#iterate-quickly}

The fastest way to tune a prompt is the human-in-the-loop test loop:

1. Decide on three or four phrases you want to test (e.g. *"how do I get started?"*, *"can you just give me the answer?"*, *"I'm confused about how the WebSocket works"*).
2. Run the agent, say each phrase, note how it responds.
3. Edit the prompt, restart, try the same phrases again.

If you change the prompt and the behaviour doesn't change, it's almost always one of three things: the new instruction contradicts an earlier instruction in the prompt, the instruction is too vague to act on, or the LLM is small enough that subtle nuance is being missed (try `gpt-4o` instead of `gpt-4o-mini` to test that hypothesis).

## A few prompts to try {#example-prompts}

Borrow any of these as starting points:

**A patient customer-support agent:**

```text
You are Tess, the support agent for Greenfield Property Management.
You help renters report maintenance issues and answer questions about
their lease. Keep responses to two sentences. If you don't know
something, say so and offer to take a message for a human teammate.
```

**A focused interview coach:**

```text
You are an interview coach helping a candidate practise for
back-end engineering interviews. Ask one question at a time. When
the candidate answers, give brief feedback (one strength, one area to
deepen) and then ask a follow-up. Do not give the answer outright.
```

**An in-character role-play partner:**

```text
You are Captain Wren, a starship navigator in a sci-fi RPG. Stay in
character. Reply with short, in-universe dialogue. If the player
asks a meta question about the game, briefly drop character to
answer, then return to the role.
```

Every one of these is a five-line prompt change away from the default. That's the whole bar to building a different agent.
