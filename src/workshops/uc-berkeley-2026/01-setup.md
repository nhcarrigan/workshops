---
title: "Setup"
checks:
  free-credit:
    question: "How much free credit does a new Deepgram account get?"
    options:
      - text: "$200"
        correct: true
        feedback: "Right — $200 in credit, applied as soon as you register. This whole workshop should cost well under a dollar."
      - text: "$10"
        correct: false
        feedback: "It's $200 — plenty to keep playing with after the workshop ends."
      - text: "Unlimited usage during the workshop"
        correct: false
        feedback: "Not unlimited, but $200 is more than you'll ever need today."
  pick-a-flow:
    question: "Which branch should you clone for the JavaScript flow?"
    options:
      - text: "The `javascript` branch."
        correct: true
        feedback: "Right — `git clone -b javascript ...` lands you on the JS scaffold. The `python` branch has the Python scaffold."
      - text: "The `main` branch."
        correct: false
        feedback: "`main` only holds the workshop landing page with QR codes. The actual scaffolds live on the language branches."
      - text: "Either — they're identical."
        correct: false
        feedback: "They're not — each branch ships only the files for its own language."
pauses:
  drop-api-key: "Wait until everyone has their API key dropped into `.env` before moving on."
---

Before we look at any code, get your environment ready. The whole setup is five steps and should take under five minutes if your machine is in good shape.

## Sign up at console.deepgram.com {#sign-up}

Go to [dpgr.am/ucb-ai-signup](https://dpgr.am/ucb-ai-signup) and sign up. You can use Google, GitHub, or email — whichever is fastest. If you already have an account, just log in.

| Sign up |
| --- |
| [![Sign up QR code](/qrs/ucb-ai-signup.png)](https://dpgr.am/ucb-ai-signup) |

## Claim your free credit {#free-credit}

Brand-new Deepgram accounts get **$200 in credit** applied automatically. You won't come close to using that today — the workshop costs well under a dollar in usage — but you'll have plenty left to keep building after we wrap.

## Pick a flow and clone the starter repo {#pick-a-flow}

The workshop ships two scaffolds — one in Python, one in JavaScript — on separate branches of the same repo. Pick whichever you're more comfortable with and clone that branch.

| Workshop repo |
| --- |
| [![Workshop repo QR code](/qrs/ucb-ai-repo.png)](https://dpgr.am/ucb-ai-repo) |

:::tabs
@tab python Python
```bash
git clone -b python https://github.com/deepgram-devs/uc-berkeley-ai-workshop-2026.git
cd uc-berkeley-ai-workshop-2026
```

The Python branch is intentionally small: one `main.py` file, a `pyproject.toml`, an `.env.example`, and a short README.

@tab javascript JavaScript
```bash
git clone -b javascript https://github.com/deepgram-devs/uc-berkeley-ai-workshop-2026.git
cd uc-berkeley-ai-workshop-2026
```

The JavaScript branch is intentionally small: one `main.js` file, a `package.json`, an `.env.example`, and a short README.
:::

## Drop your API key in `.env` {#drop-api-key}

Copy the example env file and open it in your editor:

```bash
cp .env.example .env
```

Then in the Deepgram console, go to **API Keys → Create a New API Key**, name it anything you like, copy the value, and paste it into `.env`:

```bash
DEEPGRAM_API_KEY=your_key_here
```

> **Important:** don't commit the real `.env` file. The repo's `.gitignore` already excludes it.

## Install dependencies {#install}

:::tabs
@tab python Python
We use [uv](https://docs.astral.sh/uv/) for Python project management. It's faster than pip and handles virtual environments for you.

On macOS or Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows (PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Then install the workshop's dependencies:

```bash
uv install
```

If your system Python is older than 3.13, don't worry — `uv` will fetch the right version for you automatically.

@tab javascript JavaScript
We use [pnpm](https://pnpm.io/) for the JavaScript flow. The workshop targets Node 22.

If you don't already have pnpm:

```bash
npm install -g pnpm
```

Then install the workshop's dependencies:

```bash
pnpm install
```

The JS audio packages (`mic` and `speaker`) shell out to system audio tools, so you'll also need one of these installed on your machine:

- **Linux:** `sudo apt install -y sox alsa-utils` (provides `sox` and `arecord`)
- **macOS:** `brew install sox`
- **Windows:** `choco install sox.portable`
:::

## WSL users: bridge PulseAudio to ALSA {#wsl}

If you're on Windows Subsystem for Linux, audio routing needs a small fix. WSL routes audio through PulseAudio, but the underlying audio libraries only see ALSA. Install the bridge:

```bash
sudo apt install -y libasound2-plugins
cat > ~/.asoundrc <<EOF
pcm.!default { type pulse }
ctl.!default { type pulse }
EOF
```

If you're on native Windows, macOS, or desktop Linux, skip this step.
