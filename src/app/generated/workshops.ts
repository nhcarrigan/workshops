// AUTO-GENERATED FILE — do not edit by hand.
// Source: src/workshops/<slug>/. Regenerate with `pnpm build:workshops`.
/* eslint-disable */
import type { Workshop } from '../types/workshop';

export const WORKSHOPS: readonly Workshop[] = [
  {
    "slug": "uc-berkeley-2026",
    "title": "UC Berkeley AI Workshop 2026",
    "tagline": "Build a bare-minimum Deepgram voice agent in Python or JavaScript",
    "description": "A hands-on session walking through the smallest possible voice agent, in your choice of language. The Python flow uses <code>uv</code> for environment management and <code>sounddevice</code> for cross-platform mic and speaker I/O. The JavaScript flow uses <code>pnpm</code> and the <code>mic</code> + <code>speaker</code> packages for the same loop. Both flows connect to the same Deepgram Voice Agent WebSocket for the listen/think/speak chain.",
    "sections": [
      {
        "slug": "overview",
        "title": "Overview",
        "order": 0,
        "intro": "<p>A voice agent is, at its core, three components hooked together in a loop. Audio comes in, audio goes out, and a model in the middle decides what to say.</p>\n",
        "steps": [
          {
            "id": "three-blocks",
            "title": "The three building blocks",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>A voice agent has three jobs to do, and each one is handled by a different kind of model.</p>\n<p><strong>Speech-to-Text (STT)</strong> turns whatever audio comes in from a microphone into actual words. Deepgram&#39;s <code>nova-3</code> model — what we&#39;ll use today — streams transcripts as you speak, so there&#39;s no waiting for a full utterance before the agent can react.</p>\n<p><strong>A Large Language Model (or Reasoning Model) — the LLM/LRM</strong> — is the brain. It takes the transcript, mixes it with the conversation history and the agent&#39;s instructions, and decides what the agent should say back. We&#39;re using OpenAI&#39;s <code>gpt-4o-mini</code> because it&#39;s fast and cheap, but the same pattern works with Claude, Gemini, Llama, and others. You can swap providers without rewriting code.</p>\n<p><strong>Text-to-Speech (TTS)</strong> turns the model&#39;s reply text back into audio. Deepgram&#39;s TTS family is called Aura. We&#39;ll start with <code>aura-2-asteria-en</code>, but there are around fifty voices to pick from across seven languages (English, Spanish, Dutch, French, German, Italian, Japanese).</p>\n"
              }
            ],
            "quiz": {
              "question": "What are the three building blocks of a voice agent?",
              "options": [
                {
                  "text": "Speech-to-Text, an LLM/LRM, and Text-to-Speech",
                  "correct": true,
                  "feedback": "Right — STT turns audio into text, the model decides what to say, and TTS turns the response back into audio."
                },
                {
                  "text": "A microphone, a speaker, and an internet connection",
                  "correct": false,
                  "feedback": "Those are the physical pieces, but the three software components are STT, an LLM, and TTS."
                },
                {
                  "text": "Nova-3, GPT-4, and Aura-2",
                  "correct": false,
                  "feedback": "Those are the specific models we&#39;ll use today, but the building blocks are categories — STT, LLM/LRM, and TTS — and each one is swappable."
                }
              ]
            }
          },
          {
            "id": "orchestration",
            "title": "How the Voice Agent fits in",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>You could wire those three components together yourself — call your own STT, pipe the transcript into your own LLM call, send the response into your own TTS — but you&#39;d spend most of your time on plumbing rather than on what the agent actually does.</p>\n<p>Deepgram&#39;s Voice Agent does the orchestration for you. You give it your settings:</p>\n<ul>\n<li>Which STT model</li>\n<li>Which LLM provider and model</li>\n<li>Which TTS voice</li>\n<li>The agent&#39;s personality (system prompt) and greeting</li>\n</ul>\n<p>…and it hands you a WebSocket. Audio bytes go in, audio bytes come out. The agent handles turn-taking, interruptions, and the back-and-forth between providers internally.</p>\n<p>The rest of this workshop is about <em>configuring</em> that orchestrator, not about reimplementing it.</p>\n"
              }
            ],
            "quiz": {
              "question": "What does Deepgram&#39;s Voice Agent orchestrate for you?",
              "options": [
                {
                  "text": "The STT → LLM → TTS pipeline, plus turn-taking and interruptions",
                  "correct": true,
                  "feedback": "Exactly — you give it settings and it handles all the in-between plumbing."
                },
                {
                  "text": "Nothing — you wire each component up yourself",
                  "correct": false,
                  "feedback": "Wiring it yourself is possible, but the Voice Agent does it for you so you can focus on the agent&#39;s behaviour."
                },
                {
                  "text": "Only the audio streaming — the LLM piece is on you",
                  "correct": false,
                  "feedback": "The Voice Agent talks directly to the LLM provider you configure. You don&#39;t manage that yourself."
                }
              ]
            }
          }
        ]
      },
      {
        "slug": "setup",
        "title": "Setup",
        "order": 1,
        "intro": "<p>Before we look at any code, get your environment ready. The whole setup is five steps and should take under five minutes if your machine is in good shape.</p>\n",
        "steps": [
          {
            "id": "sign-up",
            "title": "Sign up at console.deepgram.com",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Go to <a href=\"https://dpgr.am/ucb-ai-signup\">dpgr.am/ucb-ai-signup</a> and sign up. You can use Google, GitHub, or email — whichever is fastest. If you already have an account, just log in.</p>\n<table>\n<thead>\n<tr>\n<th>Sign up</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"https://dpgr.am/ucb-ai-signup\"><img src=\"/qrs/ucb-ai-signup.png\" alt=\"Sign up QR code\"></a></td>\n</tr>\n</tbody></table>\n"
              }
            ]
          },
          {
            "id": "free-credit",
            "title": "Claim your free credit",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Brand-new Deepgram accounts get <strong>$200 in credit</strong> applied automatically. You won&#39;t come close to using that today — the workshop costs well under a dollar in usage — but you&#39;ll have plenty left to keep building after we wrap.</p>\n"
              }
            ],
            "quiz": {
              "question": "How much free credit does a new Deepgram account get?",
              "options": [
                {
                  "text": "$200",
                  "correct": true,
                  "feedback": "Right — $200 in credit, applied as soon as you register. This whole workshop should cost well under a dollar."
                },
                {
                  "text": "$10",
                  "correct": false,
                  "feedback": "It&#39;s $200 — plenty to keep playing with after the workshop ends."
                },
                {
                  "text": "Unlimited usage during the workshop",
                  "correct": false,
                  "feedback": "Not unlimited, but $200 is more than you&#39;ll ever need today."
                }
              ]
            }
          },
          {
            "id": "pick-a-flow",
            "title": "Pick a flow and clone the starter repo",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The workshop ships two scaffolds — one in Python, one in JavaScript — on separate branches of the same repo. Pick whichever you&#39;re more comfortable with and clone that branch.</p>\n<table>\n<thead>\n<tr>\n<th>Workshop repo</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"https://dpgr.am/ucb-ai-repo\"><img src=\"/qrs/ucb-ai-repo.png\" alt=\"Workshop repo QR code\"></a></td>\n</tr>\n</tbody></table>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-bash\">git <span class=\"hljs-built_in\">clone</span> -b python https://github.com/deepgram-devs/uc-berkeley-ai-workshop-2026.git\n<span class=\"hljs-built_in\">cd</span> uc-berkeley-ai-workshop-2026\n</code></pre><p>The Python branch is intentionally small: one <code>main.py</code> file, a <code>pyproject.toml</code>, an <code>.env.example</code>, and a short README.</p>\n"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-bash\">git <span class=\"hljs-built_in\">clone</span> -b javascript https://github.com/deepgram-devs/uc-berkeley-ai-workshop-2026.git\n<span class=\"hljs-built_in\">cd</span> uc-berkeley-ai-workshop-2026\n</code></pre><p>The JavaScript branch is intentionally small: one <code>main.js</code> file, a <code>package.json</code>, an <code>.env.example</code>, and a short README.</p>\n"
                  }
                ]
              }
            ],
            "quiz": {
              "question": "Which branch should you clone for the JavaScript flow?",
              "options": [
                {
                  "text": "The <code>javascript</code> branch.",
                  "correct": true,
                  "feedback": "Right — <code>git clone -b javascript ...</code> lands you on the JS scaffold. The <code>python</code> branch has the Python scaffold."
                },
                {
                  "text": "The <code>main</code> branch.",
                  "correct": false,
                  "feedback": "<code>main</code> only holds the workshop landing page with QR codes. The actual scaffolds live on the language branches."
                },
                {
                  "text": "Either — they&#39;re identical.",
                  "correct": false,
                  "feedback": "They&#39;re not — each branch ships only the files for its own language."
                }
              ]
            }
          },
          {
            "id": "drop-api-key",
            "title": "Drop your API key in <code>.env</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Copy the example env file and open it in your editor:</p>\n<pre><code class=\"hljs language-bash\"><span class=\"hljs-built_in\">cp</span> .env.example .<span class=\"hljs-built_in\">env</span>\n</code></pre><p>Then in the Deepgram console, go to <strong>API Keys → Create a New API Key</strong>, name it anything you like, copy the value, and paste it into <code>.env</code>:</p>\n<pre><code class=\"hljs language-bash\">DEEPGRAM_API_KEY=your_key_here\n</code></pre><blockquote>\n<p><strong>Important:</strong> don&#39;t commit the real <code>.env</code> file. The repo&#39;s <code>.gitignore</code> already excludes it.</p>\n</blockquote>\n"
              }
            ],
            "pausePoint": "Wait until everyone has their API key dropped into <code>.env</code> before moving on."
          },
          {
            "id": "install",
            "title": "Install dependencies",
            "bodyParts": [
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<p>We use <a href=\"https://docs.astral.sh/uv/\">uv</a> for Python project management. It&#39;s faster than pip and handles virtual environments for you.</p>\n<p>On macOS or Linux:</p>\n<pre><code class=\"hljs language-bash\">curl -LsSf https://astral.sh/uv/install.sh | sh\n</code></pre><p>On Windows (PowerShell):</p>\n<pre><code class=\"hljs language-powershell\">powershell <span class=\"hljs-literal\">-ExecutionPolicy</span> ByPass <span class=\"hljs-literal\">-c</span> <span class=\"hljs-string\">&quot;irm https://astral.sh/uv/install.ps1 | iex&quot;</span>\n</code></pre><p>Then install the workshop&#39;s dependencies:</p>\n<pre><code class=\"hljs language-bash\">uv install\n</code></pre><p>If your system Python is older than 3.13, don&#39;t worry — <code>uv</code> will fetch the right version for you automatically.</p>\n"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<p>We use <a href=\"https://pnpm.io/\">pnpm</a> for the JavaScript flow. The workshop targets Node 22.</p>\n<p>If you don&#39;t already have pnpm:</p>\n<pre><code class=\"hljs language-bash\">npm install -g pnpm\n</code></pre><p>Then install the workshop&#39;s dependencies:</p>\n<pre><code class=\"hljs language-bash\">pnpm install\n</code></pre><p>The JS audio packages (<code>mic</code> and <code>speaker</code>) shell out to system audio tools, so you&#39;ll also need one of these installed on your machine:</p>\n<ul>\n<li><strong>Linux:</strong> <code>sudo apt install -y sox alsa-utils</code> (provides <code>sox</code> and <code>arecord</code>)</li>\n<li><strong>macOS:</strong> <code>brew install sox</code></li>\n<li><strong>Windows:</strong> <code>choco install sox.portable</code></li>\n</ul>\n"
                  }
                ]
              }
            ]
          },
          {
            "id": "wsl",
            "title": "WSL users: bridge PulseAudio to ALSA",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>If you&#39;re on Windows Subsystem for Linux, audio routing needs a small fix. WSL routes audio through PulseAudio, but the underlying audio libraries only see ALSA. Install the bridge:</p>\n<pre><code class=\"hljs language-bash\"><span class=\"hljs-built_in\">sudo</span> apt install -y libasound2-plugins\n<span class=\"hljs-built_in\">cat</span> &gt; ~/.asoundrc &lt;&lt;<span class=\"hljs-string\">EOF\npcm.!default { type pulse }\nctl.!default { type pulse }\nEOF</span>\n</code></pre><p>If you&#39;re on native Windows, macOS, or desktop Linux, skip this step.</p>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "settings",
        "title": "Agent Settings",
        "order": 2,
        "intro": "<p>Everything about your agent&#39;s behaviour starts with a single settings object. We send it once, the agent applies it, and we&#39;re off to the races.</p>\n",
        "steps": [
          {
            "id": "audio-format",
            "title": "Configure audio I/O",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>audio</code> block tells Deepgram what format your microphone is sending and what format you want the agent&#39;s voice in. We use <code>linear16</code> (raw 16-bit PCM) at 24 kHz for both, which keeps the wiring trivial.</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">SAMPLE_RATE = <span class=\"hljs-number\">24000</span>\n\naudio = AgentV1SettingsAudio(\n    <span class=\"hljs-built_in\">input</span>=AgentV1SettingsAudioInput(encoding=<span class=\"hljs-string\">&quot;linear16&quot;</span>, sample_rate=SAMPLE_RATE),\n    output=AgentV1SettingsAudioOutput(encoding=<span class=\"hljs-string\">&quot;linear16&quot;</span>, sample_rate=SAMPLE_RATE),\n)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> <span class=\"hljs-variable constant_\">SAMPLE_RATE</span> = <span class=\"hljs-number\">24000</span>;\n\n<span class=\"hljs-keyword\">const</span> audio = {\n  <span class=\"hljs-attr\">input</span>:  { <span class=\"hljs-attr\">encoding</span>: <span class=\"hljs-string\">&quot;linear16&quot;</span>, <span class=\"hljs-attr\">sample_rate</span>: <span class=\"hljs-variable constant_\">SAMPLE_RATE</span> },\n  <span class=\"hljs-attr\">output</span>: { <span class=\"hljs-attr\">encoding</span>: <span class=\"hljs-string\">&quot;linear16&quot;</span>, <span class=\"hljs-attr\">sample_rate</span>: <span class=\"hljs-variable constant_\">SAMPLE_RATE</span> },\n};\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>You can use different sample rates and encodings if your input device or output target needs them — <code>mulaw</code> and <code>alaw</code> are common for phone-system integrations — but stick with <code>linear16</code> at 24 kHz for this workshop.</p>\n"
              }
            ],
            "quiz": {
              "question": "Why do we configure both <code>input</code> and <code>output</code> audio blocks?",
              "options": [
                {
                  "text": "So the agent knows what format your mic is sending and what format it should reply with.",
                  "correct": true,
                  "feedback": "Right — the agent transcribes the format you declare on input and synthesises in the format you declare on output."
                },
                {
                  "text": "Because the SDK throws if <code>output</code> is missing.",
                  "correct": false,
                  "feedback": "The SDK accepts a settings block without <code>output</code>, but then you can&#39;t play the agent&#39;s voice back."
                },
                {
                  "text": "To enable echo cancellation.",
                  "correct": false,
                  "feedback": "Echo cancellation isn&#39;t something Deepgram handles — that&#39;s a client-side OS concern."
                }
              ]
            }
          },
          {
            "id": "wire-providers",
            "title": "Wire the listen / think / speak chain",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>agent</code> block is where you describe the three components from the overview. Each one is a separate provider configuration.</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">agent = AgentV1SettingsAgent(\n    listen=AgentV1SettingsAgentListen(\n        provider=AgentV1SettingsAgentListenProvider_V1(\n            <span class=\"hljs-built_in\">type</span>=<span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n            model=<span class=\"hljs-string\">&quot;nova-3&quot;</span>,\n        ),\n    ),\n    think=ThinkSettingsV1(\n        provider=ThinkSettingsV1Provider_OpenAi(\n            <span class=\"hljs-built_in\">type</span>=<span class=\"hljs-string\">&quot;open_ai&quot;</span>,\n            model=<span class=\"hljs-string\">&quot;gpt-4o-mini&quot;</span>,\n            temperature=<span class=\"hljs-number\">0.7</span>,\n        ),\n        prompt=<span class=\"hljs-string\">&quot;You are a helpful AI assistant. Keep your responses brief.&quot;</span>,\n    ),\n    speak=SpeakSettingsV1(\n        provider=SpeakSettingsV1Provider_Deepgram(\n            <span class=\"hljs-built_in\">type</span>=<span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n            model=<span class=\"hljs-string\">&quot;aura-2-asteria-en&quot;</span>,\n        ),\n    ),\n    greeting=<span class=\"hljs-string\">&quot;Hello! I&#x27;m a Deepgram voice agent. What would you like to talk about?&quot;</span>,\n)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> agent = {\n  <span class=\"hljs-attr\">listen</span>: {\n    <span class=\"hljs-attr\">provider</span>: {\n      <span class=\"hljs-attr\">type</span>:  <span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n      <span class=\"hljs-attr\">model</span>: <span class=\"hljs-string\">&quot;nova-3&quot;</span>,\n    },\n  },\n  <span class=\"hljs-attr\">think</span>: {\n    <span class=\"hljs-attr\">provider</span>: {\n      <span class=\"hljs-attr\">type</span>:        <span class=\"hljs-string\">&quot;open_ai&quot;</span>,\n      <span class=\"hljs-attr\">model</span>:       <span class=\"hljs-string\">&quot;gpt-4o-mini&quot;</span>,\n      <span class=\"hljs-attr\">temperature</span>: <span class=\"hljs-number\">0.7</span>,\n    },\n    <span class=\"hljs-attr\">prompt</span>: <span class=\"hljs-string\">&quot;You are a helpful AI assistant. Keep your responses brief.&quot;</span>,\n  },\n  <span class=\"hljs-attr\">speak</span>: {\n    <span class=\"hljs-attr\">provider</span>: {\n      <span class=\"hljs-attr\">type</span>:  <span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n      <span class=\"hljs-attr\">model</span>: <span class=\"hljs-string\">&quot;aura-2-asteria-en&quot;</span>,\n    },\n  },\n  <span class=\"hljs-attr\">greeting</span>: <span class=\"hljs-string\">&quot;Hello! I&#x27;m a Deepgram voice agent. What would you like to talk about?&quot;</span>,\n};\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>A few things worth calling out:</p>\n<ul>\n<li>The <code>listen</code> provider is Deepgram&#39;s <code>nova-3</code> — Deepgram&#39;s flagship streaming STT model.</li>\n<li>The <code>think</code> provider is OpenAI&#39;s <code>gpt-4o-mini</code>. Temperature <code>0.7</code> is conversational without going off the rails.</li>\n<li>The <code>speak</code> provider is <code>aura-2-asteria-en</code> — one of around fifty Aura-2 voices. We&#39;ll swap voices in a later section.</li>\n</ul>\n"
              }
            ]
          },
          {
            "id": "prompt-role",
            "title": "Shape the personality with <code>prompt</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>prompt</code> field inside <code>think</code> is where the agent&#39;s personality lives. The starter says <em>&quot;You are a helpful AI assistant. Keep your responses brief.&quot;</em> — about as generic as it gets.</p>\n<p>Most of the real work in building a useful voice agent happens in this string. We&#39;ll iterate on the prompt in the <a href=\"/uc-berkeley-2026/personality\">Personality</a> section.</p>\n"
              }
            ],
            "quiz": {
              "question": "What does the <code>prompt</code> field inside <code>think</code> actually control?",
              "options": [
                {
                  "text": "The agent&#39;s personality and behaviour — its instructions for every turn.",
                  "correct": true,
                  "feedback": "Exactly. Most of the work in shaping a real agent happens in this string."
                },
                {
                  "text": "The text the agent says first when it connects.",
                  "correct": false,
                  "feedback": "That&#39;s the <code>greeting</code> field. The <code>prompt</code> is the system-level instructions sent on every turn."
                },
                {
                  "text": "The user&#39;s transcribed speech.",
                  "correct": false,
                  "feedback": "The transcribed speech is sent in <code>ConversationText</code> messages — separate from the static prompt."
                }
              ]
            }
          },
          {
            "id": "greeting",
            "title": "Greet the user with <code>greeting</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>greeting</code> field is the line your agent says the moment a session opens, before the user has spoken. It&#39;s both a UX nicety and a quick way to verify audio playback is working on the user&#39;s end.</p>\n"
              }
            ]
          },
          {
            "id": "send-settings",
            "title": "Assemble and send the settings",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Wrap both blocks into a single settings object:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">SETTINGS = AgentV1Settings(audio=audio, agent=agent)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> <span class=\"hljs-variable constant_\">SETTINGS</span> = { <span class=\"hljs-attr\">type</span>: <span class=\"hljs-string\">&quot;Settings&quot;</span>, audio, agent };\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>You&#39;ll send this object exactly once per session, right after the WebSocket opens. The agent emits a <code>SettingsApplied</code> event when it&#39;s ready for media.</p>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "events",
        "title": "Handling Events",
        "order": 3,
        "intro": "<p>Every message the Voice Agent sends you flows through one callback. Some are audio bytes, some are JSON-shaped events, and your handler decides what to do with each one.</p>\n",
        "steps": [
          {
            "id": "bytes-path",
            "title": "Handle audio bytes first",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The first check is the most important: if the message is raw bytes, write it to your speaker output. That&#39;s how the agent talks.</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">def</span> <span class=\"hljs-title function_\">on_message</span>(<span class=\"hljs-params\">message: AgentMessage</span>) -&gt; <span class=\"hljs-literal\">None</span>:\n    <span class=\"hljs-keyword\">if</span> <span class=\"hljs-built_in\">isinstance</span>(message, <span class=\"hljs-built_in\">bytes</span>):\n        speaker.write(message)\n        <span class=\"hljs-keyword\">return</span>\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\">agent.<span class=\"hljs-title function_\">on</span>(<span class=\"hljs-string\">&quot;message&quot;</span>, <span class=\"hljs-function\">(<span class=\"hljs-params\">message</span>) =&gt;</span> {\n  <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-title class_\">Buffer</span>.<span class=\"hljs-title function_\">isBuffer</span>(message)) {\n    speaker.<span class=\"hljs-title function_\">write</span>(message);\n    <span class=\"hljs-keyword\">return</span>;\n  }\n  <span class=\"hljs-comment\">// ...JSON event handling below</span>\n});\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>The bytes are already in the encoding you declared in <code>audio.output</code>, so you can feed them straight to the speaker output stream without any decoding step.</p>\n"
              }
            ],
            "quiz": {
              "question": "What do you do when the message handler receives raw audio bytes?",
              "options": [
                {
                  "text": "Write them straight to the speaker output stream.",
                  "correct": true,
                  "feedback": "Right — raw audio bytes are the agent&#39;s synthesised voice, and they&#39;re already in your output encoding."
                },
                {
                  "text": "Decode them as JSON first.",
                  "correct": false,
                  "feedback": "Audio bytes aren&#39;t JSON — only the event messages are JSON-shaped objects."
                },
                {
                  "text": "Send them to the LLM as context.",
                  "correct": false,
                  "feedback": "The Voice Agent handles all the in-between routing. Your job with audio bytes is to play them."
                }
              ]
            }
          },
          {
            "id": "dispatch",
            "title": "Dispatch on <code>type</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>For non-byte messages, the <code>type</code> field tells you which event you&#39;re looking at. The handler covers all the common ones:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">message_type = <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;type&quot;</span>, <span class=\"hljs-string\">&quot;Unknown&quot;</span>)\n\n<span class=\"hljs-keyword\">if</span> message_type == <span class=\"hljs-string\">&quot;SettingsApplied&quot;</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Settings applied&quot;</span>)\n    settings_applied.<span class=\"hljs-built_in\">set</span>()\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;ConversationText&quot;</span>:\n    role = <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;role&quot;</span>, <span class=\"hljs-string\">&quot;unknown&quot;</span>)\n    content = <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;content&quot;</span>, <span class=\"hljs-string\">&quot;&quot;</span>)\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">f&quot;[<span class=\"hljs-subst\">{role}</span>] <span class=\"hljs-subst\">{content}</span>&quot;</span>)\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;UserStartedSpeaking&quot;</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;&gt;&gt; User started speaking&quot;</span>)\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;AgentThinking&quot;</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent thinking...&quot;</span>)\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;AgentStartedSpeaking&quot;</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent started speaking&quot;</span>)\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;AgentAudioDone&quot;</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent finished speaking&quot;</span>)\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;Error&quot;</span>:\n    code = <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;code&quot;</span>, <span class=\"hljs-string\">&quot;unknown&quot;</span>)\n    description = <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;description&quot;</span>, <span class=\"hljs-string\">&quot;unknown error&quot;</span>)\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">f&quot;&gt;&gt; Agent error: <span class=\"hljs-subst\">{code}</span> - <span class=\"hljs-subst\">{description}</span>&quot;</span>)\n<span class=\"hljs-keyword\">else</span>:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">f&quot;&gt;&gt; <span class=\"hljs-subst\">{message_type}</span>&quot;</span>)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">switch</span> (message.<span class=\"hljs-property\">type</span>) {\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;SettingsApplied&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Settings applied&quot;</span>);\n    <span class=\"hljs-title function_\">resolveSettingsApplied</span>();\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;ConversationText&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">`[<span class=\"hljs-subst\">${message.role ?? <span class=\"hljs-string\">&quot;unknown&quot;</span>}</span>] <span class=\"hljs-subst\">${message.content ?? <span class=\"hljs-string\">&quot;&quot;</span>}</span>`</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;UserStartedSpeaking&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;&gt;&gt; User started speaking&quot;</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;AgentThinking&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent thinking...&quot;</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;AgentStartedSpeaking&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent started speaking&quot;</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;AgentAudioDone&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;&gt;&gt; Agent finished speaking&quot;</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;Error&quot;</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">`&gt;&gt; Agent error: <span class=\"hljs-subst\">${message.code ?? <span class=\"hljs-string\">&quot;unknown&quot;</span>}</span> - <span class=\"hljs-subst\">${message.description ?? <span class=\"hljs-string\">&quot;unknown error&quot;</span>}</span>`</span>);\n    <span class=\"hljs-keyword\">break</span>;\n  <span class=\"hljs-attr\">default</span>:\n    <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">`&gt;&gt; <span class=\"hljs-subst\">${message.type}</span>`</span>);\n}\n</code></pre>"
                  }
                ]
              }
            ]
          },
          {
            "id": "settings-applied",
            "title": "Synchronise on <code>SettingsApplied</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>SettingsApplied</code> event is the handshake that tells you the agent has acknowledged your config and is ready to accept media. Before that, sending mic audio is a no-op at best and an error at worst.</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<p>We use a <code>threading.Event</code> so the main thread can wait for the handshake before opening the microphone:</p>\n<pre><code class=\"hljs language-python\">settings_applied = threading.Event()\n\n<span class=\"hljs-comment\"># Inside on_message:</span>\n<span class=\"hljs-keyword\">if</span> message_type == <span class=\"hljs-string\">&quot;SettingsApplied&quot;</span>:\n    settings_applied.<span class=\"hljs-built_in\">set</span>()\n\n<span class=\"hljs-comment\"># Later, after sending settings:</span>\n<span class=\"hljs-keyword\">if</span> <span class=\"hljs-keyword\">not</span> settings_applied.wait(<span class=\"hljs-number\">10</span>):\n    <span class=\"hljs-keyword\">raise</span> TimeoutError(<span class=\"hljs-string\">&quot;Timed out waiting for agent settings to apply.&quot;</span>)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<p>We use a manually-resolved <code>Promise</code> so the main flow can <code>await</code> the handshake before opening the microphone:</p>\n<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">let</span> resolveSettingsApplied;\n<span class=\"hljs-keyword\">const</span> settingsApplied = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Promise</span>(<span class=\"hljs-function\">(<span class=\"hljs-params\">resolve</span>) =&gt;</span> {\n  resolveSettingsApplied = resolve;\n});\n\n<span class=\"hljs-comment\">// Inside the message handler:</span>\n<span class=\"hljs-keyword\">if</span> (message.<span class=\"hljs-property\">type</span> === <span class=\"hljs-string\">&quot;SettingsApplied&quot;</span>) {\n  <span class=\"hljs-title function_\">resolveSettingsApplied</span>();\n}\n\n<span class=\"hljs-comment\">// Later, after sending settings:</span>\n<span class=\"hljs-keyword\">const</span> settingsTimeout = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Promise</span>(<span class=\"hljs-function\">(<span class=\"hljs-params\">_, reject</span>) =&gt;</span> {\n  <span class=\"hljs-built_in\">setTimeout</span>(<span class=\"hljs-function\">() =&gt;</span> <span class=\"hljs-title function_\">reject</span>(<span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Error</span>(<span class=\"hljs-string\">&quot;Timed out waiting for agent settings to apply.&quot;</span>)), <span class=\"hljs-number\">10000</span>);\n});\n<span class=\"hljs-keyword\">await</span> <span class=\"hljs-title class_\">Promise</span>.<span class=\"hljs-title function_\">race</span>([settingsApplied, settingsTimeout]);\n</code></pre>"
                  }
                ]
              }
            ],
            "quiz": {
              "question": "Why do we wait for <code>SettingsApplied</code> before starting the microphone?",
              "options": [
                {
                  "text": "The agent isn&#39;t ready to accept media until it&#39;s confirmed our settings.",
                  "correct": true,
                  "feedback": "Exactly — sending mic audio before the agent is configured would either be dropped or cause an error."
                },
                {
                  "text": "It&#39;s only an aesthetic delay — the mic would work either way.",
                  "correct": false,
                  "feedback": "It&#39;s a real handshake — until you see <code>SettingsApplied</code>, the agent doesn&#39;t know what audio format to expect."
                },
                {
                  "text": "Because the mic permission prompt blocks until then.",
                  "correct": false,
                  "feedback": "The mic permission is unrelated. The wait is for the protocol-level handshake."
                }
              ]
            }
          },
          {
            "id": "other-events",
            "title": "Useful events for UI and observability",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The remaining events aren&#39;t required for the agent to function, but they&#39;re useful for everything else you might build around it:</p>\n<ul>\n<li><code>ConversationText</code> carries the transcribed speech — both yours (with <code>role: user</code>) and the agent&#39;s reply (with <code>role: assistant</code>). This is what you&#39;d log to a database, push to a frontend transcript pane, or feed to analytics.</li>\n<li><code>UserStartedSpeaking</code> fires the moment the agent detects you began speaking. Useful for &quot;user is interrupting&quot; UI cues, though the Voice Agent handles the actual interrupt routing for you internally.</li>\n<li><code>AgentThinking</code>, <code>AgentStartedSpeaking</code>, <code>AgentAudioDone</code> are progress markers around the agent&#39;s own turn. Pair them with a UI indicator to show users when the agent is &quot;listening&quot; vs. &quot;thinking&quot; vs. &quot;speaking&quot;.</li>\n<li><code>Error</code> and the various <code>*Updated</code> events you can extend the handler to react to as your agent gets fancier.</li>\n</ul>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "audio",
        "title": "Audio Plumbing",
        "order": 4,
        "intro": "<p>Audio bytes flow in both directions. The agent&#39;s speech comes in over the WebSocket and needs somewhere to play; your microphone audio comes in from the OS and needs to be shipped out to Deepgram.</p>\n<p>The libraries we use to talk to the operating system differ by language:</p>\n<ul>\n<li><strong>Python</strong> uses <a href=\"https://python-sounddevice.readthedocs.io/\"><code>sounddevice</code></a>, which ships PortAudio binaries inside its Python wheels — most attendees won&#39;t need to install anything system-level on macOS, Windows, or desktop Linux.</li>\n<li><strong>JavaScript</strong> uses <a href=\"https://www.npmjs.com/package/mic\"><code>mic</code></a> for input and <a href=\"https://www.npmjs.com/package/speaker\"><code>speaker</code></a> for output. <code>mic</code> shells out to <code>sox</code> (macOS, Windows) or <code>arecord</code> (Linux), so those need to be installed — see the <a href=\"/uc-berkeley-2026/setup#install\">Setup</a> section.</li>\n</ul>\n",
        "steps": [
          {
            "id": "speaker-first",
            "title": "Open the speaker stream first",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Before we even send our agent settings, we open the speaker so it&#39;s ready for the agent&#39;s greeting:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">import</span> sounddevice <span class=\"hljs-keyword\">as</span> sd\n\nSAMPLE_RATE = <span class=\"hljs-number\">24000</span>\nCHANNELS = <span class=\"hljs-number\">1</span>\nDTYPE = <span class=\"hljs-string\">&quot;int16&quot;</span>  <span class=\"hljs-comment\"># linear16 == int16 PCM</span>\n\nspeaker = sd.RawOutputStream(\n    samplerate=SAMPLE_RATE,\n    channels=CHANNELS,\n    dtype=DTYPE,\n)\nspeaker.start()\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">import</span> <span class=\"hljs-title class_\">Speaker</span> <span class=\"hljs-keyword\">from</span> <span class=\"hljs-string\">&quot;speaker&quot;</span>;\n\n<span class=\"hljs-keyword\">const</span> <span class=\"hljs-variable constant_\">SAMPLE_RATE</span> = <span class=\"hljs-number\">24000</span>;\n<span class=\"hljs-keyword\">const</span> <span class=\"hljs-variable constant_\">CHANNELS</span> = <span class=\"hljs-number\">1</span>;\n<span class=\"hljs-keyword\">const</span> <span class=\"hljs-variable constant_\">BIT_DEPTH</span> = <span class=\"hljs-number\">16</span>;\n\n<span class=\"hljs-keyword\">const</span> speaker = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Speaker</span>({\n  <span class=\"hljs-attr\">channels</span>:   <span class=\"hljs-variable constant_\">CHANNELS</span>,\n  <span class=\"hljs-attr\">bitDepth</span>:   <span class=\"hljs-variable constant_\">BIT_DEPTH</span>,\n  <span class=\"hljs-attr\">sampleRate</span>: <span class=\"hljs-variable constant_\">SAMPLE_RATE</span>,\n  <span class=\"hljs-attr\">signed</span>:     <span class=\"hljs-literal\">true</span>,\n});\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Inside the message handler, agent audio bytes go straight to it:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">if</span> <span class=\"hljs-built_in\">isinstance</span>(message, <span class=\"hljs-built_in\">bytes</span>):\n    speaker.write(message)\n    <span class=\"hljs-keyword\">return</span>\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">if</span> (<span class=\"hljs-title class_\">Buffer</span>.<span class=\"hljs-title function_\">isBuffer</span>(message)) {\n  speaker.<span class=\"hljs-title function_\">write</span>(message);\n  <span class=\"hljs-keyword\">return</span>;\n}\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>No decoding, no buffering of your own — the agent gives you bytes in your declared output format, and the speaker plays them.</p>\n"
              }
            ],
            "quiz": {
              "question": "Why do we open the speaker stream <em>before</em> sending settings?",
              "options": [
                {
                  "text": "So the agent&#39;s greeting audio has somewhere to land the moment the session opens.",
                  "correct": true,
                  "feedback": "Exactly — the greeting starts streaming as soon as <code>SettingsApplied</code> fires, and the speaker has to be ready for it."
                },
                {
                  "text": "Speaker streams take longer to open than mic streams.",
                  "correct": false,
                  "feedback": "Both open at roughly the same speed — the ordering is about being ready for the greeting."
                },
                {
                  "text": "It&#39;s an audio-library API requirement.",
                  "correct": false,
                  "feedback": "Neither audio library requires this order — it&#39;s about the agent lifecycle."
                }
              ]
            }
          },
          {
            "id": "mic-after-settings",
            "title": "Open the mic stream after <code>SettingsApplied</code>",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The microphone emits chunks of audio that we forward to Deepgram on every event:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">def</span> <span class=\"hljs-title function_\">microphone_callback</span>(<span class=\"hljs-params\">indata, _frames, _time_info, _status</span>):\n    agent.send_media(<span class=\"hljs-built_in\">bytes</span>(indata))\n\nmicrophone = sd.RawInputStream(\n    samplerate=SAMPLE_RATE,\n    channels=CHANNELS,\n    dtype=DTYPE,\n    callback=microphone_callback,\n)\nmicrophone.start()\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">import</span> micFactory <span class=\"hljs-keyword\">from</span> <span class=\"hljs-string\">&quot;mic&quot;</span>;\n\n<span class=\"hljs-keyword\">const</span> microphone = <span class=\"hljs-title function_\">micFactory</span>({\n  <span class=\"hljs-attr\">rate</span>:     <span class=\"hljs-title class_\">String</span>(<span class=\"hljs-variable constant_\">SAMPLE_RATE</span>),\n  <span class=\"hljs-attr\">channels</span>: <span class=\"hljs-title class_\">String</span>(<span class=\"hljs-variable constant_\">CHANNELS</span>),\n  <span class=\"hljs-attr\">bitwidth</span>: <span class=\"hljs-title class_\">String</span>(<span class=\"hljs-variable constant_\">BIT_DEPTH</span>),\n  <span class=\"hljs-attr\">encoding</span>: <span class=\"hljs-string\">&quot;signed-integer&quot;</span>,\n  <span class=\"hljs-attr\">endian</span>:   <span class=\"hljs-string\">&quot;little&quot;</span>,\n  <span class=\"hljs-attr\">device</span>:   <span class=\"hljs-string\">&quot;default&quot;</span>,\n});\n\n<span class=\"hljs-keyword\">const</span> micStream = microphone.<span class=\"hljs-title function_\">getAudioStream</span>();\nmicStream.<span class=\"hljs-title function_\">on</span>(<span class=\"hljs-string\">&quot;data&quot;</span>, <span class=\"hljs-function\">(<span class=\"hljs-params\">chunk</span>) =&gt;</span> agent.<span class=\"hljs-title function_\">sendMedia</span>(chunk));\n\nmicrophone.<span class=\"hljs-title function_\">start</span>();\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Each chunk gets shipped to Deepgram via the agent&#39;s <code>send_media</code> (Python) or <code>sendMedia</code> (JavaScript) call. The Voice Agent handles all the buffering and word-boundary detection on its side — you don&#39;t need to chunk to phrase boundaries or do any pre-processing.</p>\n<p>We deliberately start the mic <em>after</em> <code>SettingsApplied</code> so that we&#39;re not sending audio while the agent is still configuring itself.</p>\n"
              }
            ]
          },
          {
            "id": "cleanup",
            "title": "Clean shutdown on Ctrl+C",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The whole thing runs until you press Ctrl+C. Stop both streams cleanly on shutdown:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">try</span>:\n    <span class=\"hljs-keyword\">while</span> <span class=\"hljs-literal\">True</span>:\n        time.sleep(<span class=\"hljs-number\">0.1</span>)\n<span class=\"hljs-keyword\">except</span> KeyboardInterrupt:\n    <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">&quot;\\nShutting down...&quot;</span>)\n<span class=\"hljs-keyword\">finally</span>:\n    microphone.stop()\n    speaker.stop()\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> <span class=\"hljs-title function_\">shutdown</span> = (<span class=\"hljs-params\"></span>) =&gt; {\n  <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">&quot;\\nShutting down...&quot;</span>);\n  microphone.<span class=\"hljs-title function_\">stop</span>();\n  speaker.<span class=\"hljs-title function_\">end</span>();\n  process.<span class=\"hljs-title function_\">exit</span>(<span class=\"hljs-number\">0</span>);\n};\n\nprocess.<span class=\"hljs-title function_\">on</span>(<span class=\"hljs-string\">&quot;SIGINT&quot;</span>, shutdown);\nprocess.<span class=\"hljs-title function_\">on</span>(<span class=\"hljs-string\">&quot;SIGTERM&quot;</span>, shutdown);\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Stopping the streams releases the underlying audio handles. Not strictly necessary on process exit, but it&#39;s a habit worth keeping — the same pattern matters a lot more when the voice agent is embedded in a longer-running application.</p>\n"
              }
            ]
          },
          {
            "id": "troubleshooting",
            "title": "Troubleshooting audio devices",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>If the audio library can&#39;t find an input or output device, you&#39;ll see an error on startup. The most common causes:</p>\n<ul>\n<li><strong>macOS:</strong> the terminal doesn&#39;t have microphone permission yet. Run the script once, accept the system prompt, and try again.</li>\n<li><strong>WSL:</strong> no native audio routing. See the <a href=\"/uc-berkeley-2026/setup#wsl\">WSL bridge step in Setup</a>.</li>\n<li><strong>Linux (JavaScript flow):</strong> <code>sox</code> or <code>arecord</code> isn&#39;t installed. Run <code>sudo apt install -y sox alsa-utils</code>.</li>\n<li><strong>Headless Linux server:</strong> there genuinely is no audio device. You&#39;d need to pipe audio from a file or another source instead.</li>\n</ul>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "personality",
        "title": "Personality",
        "order": 5,
        "intro": "<p>The bare-minimum prompt — <em>&quot;You are a helpful AI assistant. Keep your responses brief.&quot;</em> — is fine, but it&#39;s also boring. Most of the work in building a real voice agent is iterating on this single string until the agent behaves the way you want.</p>\n",
        "steps": [
          {
            "id": "prompt-is-personality",
            "title": "The prompt <em>is</em> the agent",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The system prompt is the only piece of context the LLM has about who it is and what it&#39;s doing. It&#39;s sent on every turn, ahead of the conversation transcript.</p>\n<p>A useful prompt usually covers four things:</p>\n<ol>\n<li><strong>Who the agent is</strong> — a name, a role, a brief identity.</li>\n<li><strong>What it&#39;s there to do</strong> — its goal in this session.</li>\n<li><strong>How it should behave</strong> — tone, length, when to ask clarifying questions.</li>\n<li><strong>What it should <em>not</em> do</strong> — out-of-scope topics, things to defer to a human, anything you don&#39;t want it inventing.</li>\n</ol>\n"
              }
            ],
            "quiz": {
              "question": "Where does your agent&#39;s personality live?",
              "options": [
                {
                  "text": "In the <code>prompt</code> field inside <code>think</code>.",
                  "correct": true,
                  "feedback": "Right — this single string is the agent&#39;s instructions for every turn."
                },
                {
                  "text": "In the <code>greeting</code> field.",
                  "correct": false,
                  "feedback": "The greeting is just the first line — the prompt is the ongoing instructions."
                },
                {
                  "text": "In a separate <code>persona</code> field the SDK exposes.",
                  "correct": false,
                  "feedback": "There isn&#39;t a separate persona field — everything is in the prompt."
                }
              ]
            }
          },
          {
            "id": "try-it",
            "title": "Try a richer prompt",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Replace the <code>prompt</code> value in your settings with something that has more shape. Here&#39;s an example that turns your agent into a Socratic developer mentor:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">prompt = (\n    <span class=\"hljs-string\">&quot;Your name is Rose, and you are here to help the developer &quot;</span>\n    <span class=\"hljs-string\">&quot;begin building with Deepgram&#x27;s products. You should be &quot;</span>\n    <span class=\"hljs-string\">&quot;helpful and encouraging, but do not simply give the answers. &quot;</span>\n    <span class=\"hljs-string\">&quot;Leverage the Socratic method to guide them through their own &quot;</span>\n    <span class=\"hljs-string\">&quot;cognitive reasoning.&quot;</span>\n)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> prompt =\n  <span class=\"hljs-string\">&quot;Your name is Rose, and you are here to help the developer &quot;</span> +\n  <span class=\"hljs-string\">&quot;begin building with Deepgram&#x27;s products. You should be &quot;</span> +\n  <span class=\"hljs-string\">&quot;helpful and encouraging, but do not simply give the answers. &quot;</span> +\n  <span class=\"hljs-string\">&quot;Leverage the Socratic method to guide them through their own &quot;</span> +\n  <span class=\"hljs-string\">&quot;cognitive reasoning.&quot;</span>;\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Update the <code>greeting</code> to match the new identity:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">greeting = <span class=\"hljs-string\">&quot;Hello! I&#x27;m Rose, your mentor for all things Deepgram. What can I help you build today?&quot;</span>\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> greeting = <span class=\"hljs-string\">&quot;Hello! I&#x27;m Rose, your mentor for all things Deepgram. What can I help you build today?&quot;</span>;\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Restart the agent and have a conversation with it. Notice that even though the underlying LLM hasn&#39;t changed, the <em>agent</em> feels completely different.</p>\n"
              }
            ]
          },
          {
            "id": "iterate-quickly",
            "title": "Iterate quickly",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The fastest way to tune a prompt is the human-in-the-loop test loop:</p>\n<ol>\n<li>Decide on three or four phrases you want to test (e.g. <em>&quot;how do I get started?&quot;</em>, <em>&quot;can you just give me the answer?&quot;</em>, <em>&quot;I&#39;m confused about how the WebSocket works&quot;</em>).</li>\n<li>Run the agent, say each phrase, note how it responds.</li>\n<li>Edit the prompt, restart, try the same phrases again.</li>\n</ol>\n<p>If you change the prompt and the behaviour doesn&#39;t change, it&#39;s almost always one of three things: the new instruction contradicts an earlier instruction in the prompt, the instruction is too vague to act on, or the LLM is small enough that subtle nuance is being missed (try <code>gpt-4o</code> instead of <code>gpt-4o-mini</code> to test that hypothesis).</p>\n"
              }
            ],
            "quiz": {
              "question": "What&#39;s the fastest way to evaluate a prompt change?",
              "options": [
                {
                  "text": "Restart the script, say the same handful of test phrases, listen to how the agent responds.",
                  "correct": true,
                  "feedback": "Right — iteration is the whole game. Pick a few representative inputs and run them every time."
                },
                {
                  "text": "Run a full evaluation suite against an LLM-as-judge harness.",
                  "correct": false,
                  "feedback": "You&#39;ll get there eventually for production agents, but for workshop iteration the human-in-the-loop test loop is enough."
                },
                {
                  "text": "Read the new prompt back to yourself and trust your gut.",
                  "correct": false,
                  "feedback": "Voice agents behave in surprising ways. Always test the actual behaviour, not what you imagine the behaviour will be."
                }
              ]
            }
          },
          {
            "id": "example-prompts",
            "title": "A few prompts to try",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Borrow any of these as starting points:</p>\n<p><strong>A patient customer-support agent:</strong></p>\n<pre><code class=\"hljs language-text\">You are Tess, the support agent for Greenfield Property Management.\nYou help renters report maintenance issues and answer questions about\ntheir lease. Keep responses to two sentences. If you don&#x27;t know\nsomething, say so and offer to take a message for a human teammate.\n</code></pre><p><strong>A focused interview coach:</strong></p>\n<pre><code class=\"hljs language-text\">You are an interview coach helping a candidate practise for\nback-end engineering interviews. Ask one question at a time. When\nthe candidate answers, give brief feedback (one strength, one area to\ndeepen) and then ask a follow-up. Do not give the answer outright.\n</code></pre><p><strong>An in-character role-play partner:</strong></p>\n<pre><code class=\"hljs language-text\">You are Captain Wren, a starship navigator in a sci-fi RPG. Stay in\ncharacter. Reply with short, in-universe dialogue. If the player\nasks a meta question about the game, briefly drop character to\nanswer, then return to the role.\n</code></pre><p>Every one of these is a five-line prompt change away from the default. That&#39;s the whole bar to building a different agent.</p>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "voice",
        "title": "Voice",
        "order": 6,
        "intro": "<p>The TTS voice is the second-biggest lever you have over how your agent feels. Asteria is a good default, but Deepgram ships around fifty Aura-2 voices, and the right one depends entirely on the role the agent is playing.</p>\n",
        "steps": [
          {
            "id": "voice-model",
            "title": "Swap the voice model",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The voice is just a model id in the <code>speak</code> provider:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">speak=SpeakSettingsV1(\n    provider=SpeakSettingsV1Provider_Deepgram(\n        <span class=\"hljs-built_in\">type</span>=<span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n        model=<span class=\"hljs-string\">&quot;aura-2-pandora-en&quot;</span>,  <span class=\"hljs-comment\"># was: aura-2-asteria-en</span>\n    ),\n),\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-attr\">speak</span>: {\n  <span class=\"hljs-attr\">provider</span>: {\n    <span class=\"hljs-attr\">type</span>:  <span class=\"hljs-string\">&quot;deepgram&quot;</span>,\n    <span class=\"hljs-attr\">model</span>: <span class=\"hljs-string\">&quot;aura-2-pandora-en&quot;</span>,  <span class=\"hljs-comment\">// was: aura-2-asteria-en</span>\n  },\n},\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>Restart the agent and you&#39;ll hear the new voice on the next greeting. No other code changes required.</p>\n"
              }
            ],
            "quiz": {
              "question": "Where do you swap the agent&#39;s voice?",
              "options": [
                {
                  "text": "In the <code>speak</code> block&#39;s <code>model</code> field.",
                  "correct": true,
                  "feedback": "Right — every Aura-2 voice is just a model id you pass to the speak provider."
                },
                {
                  "text": "In the <code>prompt</code> field — you tell the LLM what voice to use.",
                  "correct": false,
                  "feedback": "The prompt controls <em>what</em> the agent says. The TTS model controls <em>how</em> it sounds."
                },
                {
                  "text": "In the <code>audio.output</code> block — the encoding controls the voice.",
                  "correct": false,
                  "feedback": "The audio output controls the format and sample rate. Voice selection is in the speak provider."
                }
              ]
            }
          },
          {
            "id": "pick-on-purpose",
            "title": "Pick on purpose",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>When you&#39;re picking a voice, you&#39;re really picking three things at once:</p>\n<ol>\n<li><strong>Apparent persona</strong> — age, energy, warmth. A calm narrator is a very different agent than a chipper customer-service rep, even with the exact same script.</li>\n<li><strong>Cadence and pacing</strong> — some voices are faster, some pause more naturally, some have more dynamic range.</li>\n<li><strong>Match with the prompt</strong> — a Socratic mentor with a flat, robotic voice is going to feel jarring. The voice and the prompt have to agree on who the agent is.</li>\n</ol>\n<p>The easiest workflow:</p>\n<ol>\n<li>Write your prompt first.</li>\n<li>Pick three or four candidate voices.</li>\n<li>Run the agent with each one and the same handful of test phrases.</li>\n<li>Trust the one that makes you flinch the least.</li>\n</ol>\n"
              }
            ],
            "quiz": {
              "question": "What&#39;s a good way to pick a voice for a real agent?",
              "options": [
                {
                  "text": "Listen to a handful of candidates with your actual prompt and decide which feels right.",
                  "correct": true,
                  "feedback": "Exactly — voice and prompt interact, so always evaluate them together."
                },
                {
                  "text": "Pick the highest-rated voice in the docs and ship it.",
                  "correct": false,
                  "feedback": "There&#39;s no single best voice — it&#39;s a fit question, not a quality question."
                },
                {
                  "text": "Use whichever voice has the most languages supported.",
                  "correct": false,
                  "feedback": "Language support matters when you actually need it, but it&#39;s a separate axis from the voice&#39;s personality."
                }
              ]
            }
          },
          {
            "id": "starter-voices",
            "title": "A few voices to start with",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>All Aura-2 model ids follow the pattern <code>aura-2-&lt;name&gt;-&lt;language&gt;</code>. A handful to try first:</p>\n<table>\n<thead>\n<tr>\n<th>Model id</th>\n<th>Vibe</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>aura-2-asteria-en</code></td>\n<td>Calm, professional, default English voice</td>\n</tr>\n<tr>\n<td><code>aura-2-pandora-en</code></td>\n<td>Warmer, more conversational</td>\n</tr>\n<tr>\n<td><code>aura-2-luna-en</code></td>\n<td>Soft, low-energy, good for guided meditations or chill assistants</td>\n</tr>\n<tr>\n<td><code>aura-2-zeus-en</code></td>\n<td>Deep, authoritative, good for narration</td>\n</tr>\n<tr>\n<td><code>aura-2-helena-en</code></td>\n<td>Crisp, news-anchor energy</td>\n</tr>\n<tr>\n<td><code>aura-2-sirio-es</code></td>\n<td>Spanish, warm and conversational</td>\n</tr>\n<tr>\n<td><code>aura-2-diana-es</code></td>\n<td>Spanish, news-anchor energy</td>\n</tr>\n</tbody></table>\n<p>For the full catalogue see Deepgram&#39;s <a href=\"https://developers.deepgram.com/docs/tts-models\">TTS voices documentation</a>.</p>\n"
              }
            ]
          },
          {
            "id": "language",
            "title": "Language and locale",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>If your agent needs to speak a different language, the voice id is where you set that. Aura-2 currently supports:</p>\n<ul>\n<li>English (<code>-en</code>)</li>\n<li>Spanish (<code>-es</code>)</li>\n<li>Dutch (<code>-nl</code>)</li>\n<li>French (<code>-fr</code>)</li>\n<li>German (<code>-de</code>)</li>\n<li>Italian (<code>-it</code>)</li>\n<li>Japanese (<code>-ja</code>)</li>\n</ul>\n<p>Pick a voice whose locale matches the language you want the agent to speak.</p>\n<p>If your STT also needs to handle that language, set <code>agent.language</code> to a matching locale code (for example <code>&quot;es&quot;</code> for Spanish) so <code>nova-3</code> decodes the user&#39;s speech in the right language too.</p>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "tools",
        "title": "Tools &amp; Function Calls",
        "order": 7,
        "intro": "<p>A voice agent that can only talk is a chatbot with a mic and speakers. A voice agent that can call tools is an assistant. This is the single biggest jump you can make in capability.</p>\n",
        "steps": [
          {
            "id": "why-tools",
            "title": "Why tools matter",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Without tools, your agent is limited to whatever the LLM already knows. It can talk about your company, but it can&#39;t look up an account. It can describe a calendar, but it can&#39;t book a meeting.</p>\n<p>Tools let the model decide <em>&quot;to answer this, I need to run a function and use the result.&quot;</em> You define the functions, Deepgram routes the call request back to you, you execute the function, send the result back, and the model integrates that result into its reply.</p>\n"
              }
            ],
            "quiz": {
              "question": "What do tools let your agent do that it couldn&#39;t do before?",
              "options": [
                {
                  "text": "Take real actions in the outside world — query APIs, look up data, change state.",
                  "correct": true,
                  "feedback": "Right — tools turn a voice-only chatbot into an actual assistant."
                },
                {
                  "text": "Speak in more languages.",
                  "correct": false,
                  "feedback": "Multilingual support comes from the TTS voice and STT model, not from tools."
                },
                {
                  "text": "Run faster.",
                  "correct": false,
                  "feedback": "Tools usually add latency rather than reducing it — they&#39;re worth it for the capability, not the speed."
                }
              ]
            }
          },
          {
            "id": "define-the-function",
            "title": "Define the function",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Functions live in your <code>think</code> settings under <code>functions</code>. Each function gets a name, a description (this is what the LLM reads to decide when to call it), a parameter schema in JSON Schema format, and a <code>client_side</code> flag.</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\">think = ThinkSettingsV1(\n    provider=ThinkSettingsV1Provider_OpenAi(\n        <span class=\"hljs-built_in\">type</span>=<span class=\"hljs-string\">&quot;open_ai&quot;</span>,\n        model=<span class=\"hljs-string\">&quot;gpt-4o-mini&quot;</span>,\n        temperature=<span class=\"hljs-number\">0.7</span>,\n    ),\n    prompt=(\n        <span class=\"hljs-string\">&quot;You are a helpful AI assistant. Keep your responses brief. &quot;</span>\n        <span class=\"hljs-string\">&quot;When the user asks for the current time, call the &quot;</span>\n        <span class=\"hljs-string\">&quot;get_current_time function and read the result back to them.&quot;</span>\n    ),\n    functions=[\n        ThinkSettingsV1FunctionsItem(\n            name=<span class=\"hljs-string\">&quot;get_current_time&quot;</span>,\n            description=<span class=\"hljs-string\">&quot;Returns the current local time as an ISO-8601 string.&quot;</span>,\n            parameters={\n                <span class=\"hljs-string\">&quot;type&quot;</span>: <span class=\"hljs-string\">&quot;object&quot;</span>,\n                <span class=\"hljs-string\">&quot;properties&quot;</span>: {},\n            },\n            client_side=<span class=\"hljs-literal\">True</span>,\n        ),\n    ],\n)\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">const</span> think = {\n  <span class=\"hljs-attr\">provider</span>: {\n    <span class=\"hljs-attr\">type</span>:        <span class=\"hljs-string\">&quot;open_ai&quot;</span>,\n    <span class=\"hljs-attr\">model</span>:       <span class=\"hljs-string\">&quot;gpt-4o-mini&quot;</span>,\n    <span class=\"hljs-attr\">temperature</span>: <span class=\"hljs-number\">0.7</span>,\n  },\n  <span class=\"hljs-attr\">prompt</span>:\n    <span class=\"hljs-string\">&quot;You are a helpful AI assistant. Keep your responses brief. &quot;</span> +\n    <span class=\"hljs-string\">&quot;When the user asks for the current time, call the &quot;</span> +\n    <span class=\"hljs-string\">&quot;get_current_time function and read the result back to them.&quot;</span>,\n  <span class=\"hljs-attr\">functions</span>: [\n    {\n      <span class=\"hljs-attr\">name</span>:        <span class=\"hljs-string\">&quot;get_current_time&quot;</span>,\n      <span class=\"hljs-attr\">description</span>: <span class=\"hljs-string\">&quot;Returns the current local time as an ISO-8601 string.&quot;</span>,\n      <span class=\"hljs-attr\">parameters</span>:  {\n        <span class=\"hljs-attr\">type</span>:       <span class=\"hljs-string\">&quot;object&quot;</span>,\n        <span class=\"hljs-attr\">properties</span>: {},\n      },\n      <span class=\"hljs-attr\">client_side</span>: <span class=\"hljs-literal\">true</span>,\n    },\n  ],\n};\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>A couple of details worth noting:</p>\n<ul>\n<li>The <code>description</code> matters. The LLM uses it to decide when to call the function — vague descriptions lead to either over-calling or under-calling.</li>\n<li>The <code>parameters</code> schema follows JSON Schema. For a no-argument function, an empty <code>properties</code> object is fine.</li>\n<li><code>client_side: true</code> means <em>you</em> run the function. Deepgram will send you a <code>FunctionCallRequest</code> and wait for your response.</li>\n</ul>\n"
              }
            ],
            "pausePoint": "Pause here if you want to sketch a function for your own use case before continuing."
          },
          {
            "id": "handle-the-call",
            "title": "Handle the call request",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Watch for <code>FunctionCallRequest</code> messages in your message handler. For each requested call, run the function and send back a <code>FunctionCallResponse</code>:</p>\n"
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "key": "python",
                    "label": "Python",
                    "html": "<pre><code class=\"hljs language-python\"><span class=\"hljs-keyword\">from</span> datetime <span class=\"hljs-keyword\">import</span> datetime\n<span class=\"hljs-keyword\">from</span> deepgram.agent.v1.types <span class=\"hljs-keyword\">import</span> AgentV1SendFunctionCallResponse\n\n<span class=\"hljs-comment\"># Inside on_message:</span>\n<span class=\"hljs-keyword\">elif</span> message_type == <span class=\"hljs-string\">&quot;FunctionCallRequest&quot;</span>:\n    <span class=\"hljs-keyword\">for</span> call <span class=\"hljs-keyword\">in</span> <span class=\"hljs-built_in\">getattr</span>(message, <span class=\"hljs-string\">&quot;functions&quot;</span>, []):\n        <span class=\"hljs-keyword\">if</span> call.name == <span class=\"hljs-string\">&quot;get_current_time&quot;</span>:\n            result = datetime.now().isoformat(timespec=<span class=\"hljs-string\">&quot;seconds&quot;</span>)\n            <span class=\"hljs-built_in\">print</span>(<span class=\"hljs-string\">f&quot;&gt;&gt; Tool call: <span class=\"hljs-subst\">{call.name}</span>() -&gt; <span class=\"hljs-subst\">{result}</span>&quot;</span>)\n            agent.send_function_call_response(\n                AgentV1SendFunctionCallResponse(\n                    <span class=\"hljs-built_in\">id</span>=call.<span class=\"hljs-built_in\">id</span>,\n                    name=call.name,\n                    content=result,\n                ),\n            )\n</code></pre>"
                  },
                  {
                    "key": "javascript",
                    "label": "JavaScript",
                    "html": "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-comment\">// Inside the message handler:</span>\n<span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&quot;FunctionCallRequest&quot;</span>:\n  <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-keyword\">const</span> call <span class=\"hljs-keyword\">of</span> message.<span class=\"hljs-property\">functions</span> ?? []) {\n    <span class=\"hljs-keyword\">if</span> (call.<span class=\"hljs-property\">name</span> === <span class=\"hljs-string\">&quot;get_current_time&quot;</span>) {\n      <span class=\"hljs-keyword\">const</span> result = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Date</span>().<span class=\"hljs-title function_\">toISOString</span>();\n      <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">`&gt;&gt; Tool call: <span class=\"hljs-subst\">${call.name}</span>() -&gt; <span class=\"hljs-subst\">${result}</span>`</span>);\n      agent.<span class=\"hljs-title function_\">sendFunctionCallResponse</span>({\n        <span class=\"hljs-attr\">id</span>:      call.<span class=\"hljs-property\">id</span>,\n        <span class=\"hljs-attr\">name</span>:    call.<span class=\"hljs-property\">name</span>,\n        <span class=\"hljs-attr\">content</span>: result,\n      });\n    }\n  }\n  <span class=\"hljs-keyword\">break</span>;\n</code></pre>"
                  }
                ]
              },
              {
                "type": "html",
                "html": "<p>The model receives your <code>content</code> string as the function&#39;s return value and uses it to generate the spoken reply.</p>\n"
              }
            ]
          },
          {
            "id": "test-it",
            "title": "Test it",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Restart your agent and ask <em>&quot;what time is it?&quot;</em> You should see the agent&#39;s thinking event fire, then the tool-call log line print in your terminal, then the agent speak the time back to you.</p>\n<p>If the function is being called too eagerly or not eagerly enough, the lever is the prompt. Tell the LLM more explicitly when to call the function — for example <em>&quot;only call get_current_time if the user explicitly asks for the current time.&quot;</em></p>\n"
              }
            ]
          },
          {
            "id": "going-further",
            "title": "Going further",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Once one function works, more is easy. A few directions to try:</p>\n<ul>\n<li><strong>Look up data:</strong> call your own backend API to fetch user-specific info.</li>\n<li><strong>Take an action:</strong> send a Slack message, create a calendar event, file a ticket.</li>\n<li><strong>Compose multiple tools:</strong> a single conversation can call several functions in sequence.</li>\n</ul>\n<p>You can also use <code>client_side: false</code> for built-in helpers if Deepgram exposes them for your use case, but the vast majority of real agents use client-side functions calling your own code.</p>\n"
              }
            ]
          }
        ]
      },
      {
        "slug": "next-steps",
        "title": "Next Steps",
        "order": 8,
        "intro": "<p>You&#39;ve got a working voice agent. Time spent here was around 40 minutes. The same techniques scale up to genuinely useful products — voice support agents, in-game NPCs, accessibility tools, language-learning partners, whatever you can imagine.</p>\n",
        "steps": [
          {
            "id": "real-apis",
            "title": "Make function calls to real APIs",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The <code>get_current_time</code> toy in <a href=\"/uc-berkeley-2026/tools\">Tools</a> is just a placeholder. The same pattern lets the agent:</p>\n<ul>\n<li>Query your own backend or database to answer account-specific questions.</li>\n<li>Hit a third-party API — weather, maps, calendars, anything with HTTP.</li>\n<li>Trigger workflows — send a message, file a ticket, schedule a job.</li>\n</ul>\n<p>Most of the <em>interesting</em> voice agents you&#39;ll meet are mostly about which tools they expose, not about which LLM they use.</p>\n"
              }
            ]
          },
          {
            "id": "voices",
            "title": "Explore more voices",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Spend an evening listening through different Aura-2 voices with the same prompt. The voice shapes the agent more than people expect, and you&#39;ll quickly form strong opinions about which voices work for which roles.</p>\n<p>The catalogue is at <a href=\"https://developers.deepgram.com/docs/tts-models\">developers.deepgram.com/docs/tts-models</a>.</p>\n"
              }
            ]
          },
          {
            "id": "multilingual",
            "title": "Add multilingual support",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Nova-3 handles a long list of languages on the listen side. Aura-2 ships voices in English, Spanish, Dutch, French, German, Italian, and Japanese on the speak side. If your agent needs to handle calls in multiple languages, set <code>agent.language</code> to the appropriate locale code and pick a TTS voice in that language.</p>\n<p>For agents that need to route between languages mid-conversation, you can update settings on the fly via the <code>UpdateSpeak</code> and <code>UpdateThink</code> messages — the agent reconfigures without dropping the session.</p>\n"
              }
            ]
          },
          {
            "id": "where-to-help",
            "title": "Where to get help",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>Workshop ended, code working, big ideas in the back of your head — what next?</p>\n<p><strong>Docs</strong> — the canonical reference for every endpoint, parameter, and integration pattern.</p>\n<table>\n<thead>\n<tr>\n<th>Docs</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"https://dpgr.am/ucb-ai-docs\"><img src=\"/qrs/ucb-ai-docs.png\" alt=\"Deepgram docs QR code\"></a></td>\n</tr>\n</tbody></table>\n<p><strong>Discord</strong> — active community, Deepgram engineers hang out there, fastest place to unblock.</p>\n<table>\n<thead>\n<tr>\n<th>Discord</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"https://dpgr.am/ucb-ai-discord\"><img src=\"/qrs/ucb-ai-discord.png\" alt=\"Deepgram Discord QR code\"></a></td>\n</tr>\n</tbody></table>\n<p><strong>GitHub</strong> — longer-form questions and feature suggestions live on the discussions board.</p>\n<table>\n<thead>\n<tr>\n<th>GitHub</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><a href=\"https://dpgr.am/ucb-ai-github\"><img src=\"/qrs/ucb-ai-github.png\" alt=\"Deepgram GitHub QR code\"></a></td>\n</tr>\n</tbody></table>\n<p><strong>Find us at the booth</strong> today on the conference floor — we&#39;d love to hear what you&#39;re building.</p>\n"
              }
            ],
            "quiz": {
              "question": "If you get stuck after the workshop, where should you go first?",
              "options": [
                {
                  "text": "The Deepgram docs and the Discord at dpgr.am/ucb-ai-discord.",
                  "correct": true,
                  "feedback": "Both have active communities and quick response times. The docs cover the API, the Discord covers the messy real-world questions."
                },
                {
                  "text": "Open a support ticket on the console.",
                  "correct": false,
                  "feedback": "Support tickets work, but the Discord is usually faster for development questions."
                },
                {
                  "text": "Wait for the next workshop.",
                  "correct": false,
                  "feedback": "Don&#39;t wait. The community is the fastest path to unblocked."
                }
              ]
            }
          },
          {
            "id": "have-fun",
            "title": "And have fun",
            "bodyParts": [
              {
                "type": "html",
                "html": "<p>The barrier between <em>&quot;cool idea&quot;</em> and <em>&quot;working prototype&quot;</em> has never been lower than it is right now. Go make something weird.</p>\n"
              }
            ]
          }
        ]
      }
    ]
  }
] as const;
