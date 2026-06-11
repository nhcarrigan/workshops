---
title: "Voice"
checks:
  voice-model:
    question: "Where do you swap the agent's voice?"
    options:
      - text: "In the `speak` block's `model` field."
        correct: true
        feedback: "Right — every Aura-2 voice is just a model id you pass to the speak provider."
      - text: "In the `prompt` field — you tell the LLM what voice to use."
        correct: false
        feedback: "The prompt controls *what* the agent says. The TTS model controls *how* it sounds."
      - text: "In the `audio.output` block — the encoding controls the voice."
        correct: false
        feedback: "The audio output controls the format and sample rate. Voice selection is in the speak provider."
  pick-on-purpose:
    question: "What's a good way to pick a voice for a real agent?"
    options:
      - text: "Listen to a handful of candidates with your actual prompt and decide which feels right."
        correct: true
        feedback: "Exactly — voice and prompt interact, so always evaluate them together."
      - text: "Pick the highest-rated voice in the docs and ship it."
        correct: false
        feedback: "There's no single best voice — it's a fit question, not a quality question."
      - text: "Use whichever voice has the most languages supported."
        correct: false
        feedback: "Language support matters when you actually need it, but it's a separate axis from the voice's personality."
---

The TTS voice is the second-biggest lever you have over how your agent feels. Asteria is a good default, but Deepgram ships around fifty Aura-2 voices, and the right one depends entirely on the role the agent is playing.

## Swap the voice model {#voice-model}

The voice is just a model id in the `speak` provider:

:::tabs
@tab python Python
```python
speak=SpeakSettingsV1(
    provider=SpeakSettingsV1Provider_Deepgram(
        type="deepgram",
        model="aura-2-pandora-en",  # was: aura-2-asteria-en
    ),
),
```

@tab javascript JavaScript
```javascript
speak: {
  provider: {
    type:  "deepgram",
    model: "aura-2-pandora-en",  // was: aura-2-asteria-en
  },
},
```
:::

Restart the agent and you'll hear the new voice on the next greeting. No other code changes required.

## Pick on purpose {#pick-on-purpose}

When you're picking a voice, you're really picking three things at once:

1. **Apparent persona** — age, energy, warmth. A calm narrator is a very different agent than a chipper customer-service rep, even with the exact same script.
2. **Cadence and pacing** — some voices are faster, some pause more naturally, some have more dynamic range.
3. **Match with the prompt** — a Socratic mentor with a flat, robotic voice is going to feel jarring. The voice and the prompt have to agree on who the agent is.

The easiest workflow:

1. Write your prompt first.
2. Pick three or four candidate voices.
3. Run the agent with each one and the same handful of test phrases.
4. Trust the one that makes you flinch the least.

## A few voices to start with {#starter-voices}

All Aura-2 model ids follow the pattern `aura-2-<name>-<language>`. A handful to try first:

| Model id | Vibe |
| --- | --- |
| `aura-2-asteria-en` | Calm, professional, default English voice |
| `aura-2-pandora-en` | Warmer, more conversational |
| `aura-2-luna-en` | Soft, low-energy, good for guided meditations or chill assistants |
| `aura-2-zeus-en` | Deep, authoritative, good for narration |
| `aura-2-helena-en` | Crisp, news-anchor energy |
| `aura-2-sirio-es` | Spanish, warm and conversational |
| `aura-2-diana-es` | Spanish, news-anchor energy |

For the full catalogue see Deepgram's [TTS voices documentation](https://developers.deepgram.com/docs/tts-models).

## Language and locale {#language}

If your agent needs to speak a different language, the voice id is where you set that. Aura-2 currently supports:

- English (`-en`)
- Spanish (`-es`)
- Dutch (`-nl`)
- French (`-fr`)
- German (`-de`)
- Italian (`-it`)
- Japanese (`-ja`)

Pick a voice whose locale matches the language you want the agent to speak.

If your STT also needs to handle that language, set `agent.language` to a matching locale code (for example `"es"` for Spanish) so `nova-3` decodes the user's speech in the right language too.
