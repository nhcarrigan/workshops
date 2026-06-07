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
  uv-why:
    question: "Why are we using uv instead of pip + venv directly?"
    options:
      - text: "uv handles dependency resolution and venv creation in one fast tool, and it'll fetch a matching Python version automatically."
        correct: true
        feedback: "Exactly — it removes a lot of the friction around setting up a Python project."
      - text: "uv is required by the Deepgram SDK."
        correct: false
        feedback: "The SDK works with any Python package manager — uv is just our preference here."
      - text: "uv is the only way to install sounddevice."
        correct: false
        feedback: "sounddevice installs via any pip-compatible tool."
pauses:
  drop-api-key: "Wait until everyone has their API key dropped into `.env` before moving on."
---

Before we look at any code, get your environment ready. The whole setup is five steps and should take under five minutes if your machine is in good shape.

## Sign up at console.deepgram.com {#sign-up}

Go to [console.deepgram.com](https://console.deepgram.com) and sign up. You can use Google, GitHub, or email — whichever is fastest. If you already have an account, just log in.

## Claim your free credit {#free-credit}

Brand-new Deepgram accounts get **$200 in credit** applied automatically. You won't come close to using that today — the workshop costs well under a dollar in usage — but you'll have plenty left to keep building after we wrap.

## Clone the starter repo {#clone}

In a terminal, clone the workshop repo:

```bash
git clone https://dpgr.am/ucb-ai-repo uc-berkeley-ai-workshop-2026
cd uc-berkeley-ai-workshop-2026
```

The repo is intentionally small: one `main.py` file, a `pyproject.toml`, an `.env.example`, and a short README.

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

## Install dependencies with uv {#uv-why}

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

## WSL users: bridge PulseAudio to ALSA {#wsl}

If you're on Windows Subsystem for Linux, audio routing needs a small fix. The bundled `sounddevice` PortAudio binary only sees ALSA, and WSL routes audio through PulseAudio. Install the bridge:

```bash
sudo apt install -y libasound2-plugins
cat > ~/.asoundrc <<EOF
pcm.!default { type pulse }
ctl.!default { type pulse }
EOF
```

If you're on native Windows, macOS, or desktop Linux, skip this step.
