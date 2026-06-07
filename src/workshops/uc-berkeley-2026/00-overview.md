---
title: "Overview"
checks:
  three-blocks:
    question: "What are the three building blocks of a voice agent?"
    options:
      - text: "Speech-to-Text, an LLM/LRM, and Text-to-Speech"
        correct: true
        feedback: "Right — STT turns audio into text, the model decides what to say, and TTS turns the response back into audio."
      - text: "A microphone, a speaker, and an internet connection"
        correct: false
        feedback: "Those are the physical pieces, but the three software components are STT, an LLM, and TTS."
      - text: "Nova-3, GPT-4, and Aura-2"
        correct: false
        feedback: "Those are the specific models we'll use today, but the building blocks are categories — STT, LLM/LRM, and TTS — and each one is swappable."
  orchestration:
    question: "What does Deepgram's Voice Agent orchestrate for you?"
    options:
      - text: "The STT → LLM → TTS pipeline, plus turn-taking and interruptions"
        correct: true
        feedback: "Exactly — you give it settings and it handles all the in-between plumbing."
      - text: "Nothing — you wire each component up yourself"
        correct: false
        feedback: "Wiring it yourself is possible, but the Voice Agent does it for you so you can focus on the agent's behaviour."
      - text: "Only the audio streaming — the LLM piece is on you"
        correct: false
        feedback: "The Voice Agent talks directly to the LLM provider you configure. You don't manage that yourself."
---

A voice agent is, at its core, three components hooked together in a loop. Audio comes in, audio goes out, and a model in the middle decides what to say.

## The three building blocks {#three-blocks}

A voice agent has three jobs to do, and each one is handled by a different kind of model.

**Speech-to-Text (STT)** turns whatever audio comes in from a microphone into actual words. Deepgram's `nova-3` model — what we'll use today — streams transcripts as you speak, so there's no waiting for a full utterance before the agent can react.

**A Large Language Model (or Reasoning Model) — the LLM/LRM** — is the brain. It takes the transcript, mixes it with the conversation history and the agent's instructions, and decides what the agent should say back. We're using OpenAI's `gpt-4o-mini` because it's fast and cheap, but the same pattern works with Claude, Gemini, Llama, and others. You can swap providers without rewriting code.

**Text-to-Speech (TTS)** turns the model's reply text back into audio. Deepgram's TTS family is called Aura. We'll start with `aura-2-asteria-en`, but there are around fifty voices to pick from across seven languages (English, Spanish, Dutch, French, German, Italian, Japanese).

## How the Voice Agent fits in {#orchestration}

You could wire those three components together yourself — call your own STT, pipe the transcript into your own LLM call, send the response into your own TTS — but you'd spend most of your time on plumbing rather than on what the agent actually does.

Deepgram's Voice Agent does the orchestration for you. You give it your settings:

- Which STT model
- Which LLM provider and model
- Which TTS voice
- The agent's personality (system prompt) and greeting

…and it hands you a WebSocket. Audio bytes go in, audio bytes come out. The agent handles turn-taking, interruptions, and the back-and-forth between providers internally.

The rest of this workshop is about *configuring* that orchestrator, not about reimplementing it.
