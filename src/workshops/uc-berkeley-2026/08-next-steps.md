---
title: "Next Steps"
checks:
  where-to-help:
    question: "If you get stuck after the workshop, where should you go first?"
    options:
      - text: "The Deepgram docs and the Discord at discord.gg/deepgram."
        correct: true
        feedback: "Both have active communities and quick response times. The docs cover the API, the Discord covers the messy real-world questions."
      - text: "Open a support ticket on the console."
        correct: false
        feedback: "Support tickets work, but the Discord is usually faster for development questions."
      - text: "Wait for the next workshop."
        correct: false
        feedback: "Don't wait. The community is the fastest path to unblocked."
---

You've got a working voice agent. Time spent here was around 40 minutes. The same techniques scale up to genuinely useful products — voice support agents, in-game NPCs, accessibility tools, language-learning partners, whatever you can imagine.

## Make function calls to real APIs {#real-apis}

The `get_current_time` toy in [Tools](/uc-berkeley-2026/tools) is just a placeholder. The same pattern lets the agent:

- Query your own backend or database to answer account-specific questions.
- Hit a third-party API — weather, maps, calendars, anything with HTTP.
- Trigger workflows — send a message, file a ticket, schedule a job.

Most of the *interesting* voice agents you'll meet are mostly about which tools they expose, not about which LLM they use.

## Explore more voices {#voices}

Spend an evening listening through different Aura-2 voices with the same prompt. The voice shapes the agent more than people expect, and you'll quickly form strong opinions about which voices work for which roles.

The catalogue is at [developers.deepgram.com/docs/tts-models](https://developers.deepgram.com/docs/tts-models).

## Add multilingual support {#multilingual}

Nova-3 handles a long list of languages on the listen side. Aura-2 ships voices in English, Spanish, Dutch, French, German, Italian, and Japanese on the speak side. If your agent needs to handle calls in multiple languages, set `agent.language` to the appropriate locale code and pick a TTS voice in that language.

For agents that need to route between languages mid-conversation, you can update settings on the fly via the `UpdateSpeak` and `UpdateThink` messages — the agent reconfigures without dropping the session.

## Where to get help {#where-to-help}

Workshop ended, code working, big ideas in the back of your head — what next?

- **Docs:** [docs.deepgram.com](https://docs.deepgram.com) is the canonical reference. Voice Agent has its own section with deeper dives on the WebSocket protocol, all the settings options, and integration patterns.
- **Discord:** [discord.gg/deepgram](https://discord.gg/deepgram) — active community, Deepgram engineers hang out there, fastest place to unblock.
- **GitHub:** [github.com/orgs/deepgram/discussions](https://github.com/orgs/deepgram/discussions) for longer-form questions and feature suggestions.
- **Find us at the booth** today on the conference floor — we'd love to hear what you're building.

## And have fun {#have-fun}

The barrier between *"cool idea"* and *"working prototype"* has never been lower than it is right now. Go make something weird.
