---
title: "Tools & Function Calls"
checks:
  why-tools:
    question: "What do tools let your agent do that it couldn't do before?"
    options:
      - text: "Take real actions in the outside world — query APIs, look up data, change state."
        correct: true
        feedback: "Right — tools turn a voice-only chatbot into an actual assistant."
      - text: "Speak in more languages."
        correct: false
        feedback: "Multilingual support comes from the TTS voice and STT model, not from tools."
      - text: "Run faster."
        correct: false
        feedback: "Tools usually add latency rather than reducing it — they're worth it for the capability, not the speed."
  client-vs-server:
    question: "What's the difference between `client_side: true` and `client_side: false` on a function?"
    options:
      - text: "Client-side functions run in your own code; server-side functions are executed by Deepgram and only the result is sent back."
        correct: true
        feedback: "Right — `client_side: true` is what you'll use most often, since it lets you call your own APIs and data."
      - text: "Client-side functions are faster than server-side ones."
        correct: false
        feedback: "It's not a speed distinction — it's about where the function actually runs."
      - text: "Server-side functions are deprecated."
        correct: false
        feedback: "Both are supported. Server-side is useful for built-in helpers; client-side is for your own logic."
pauses:
  define-the-function: "Pause here if you want to sketch a function for your own use case before continuing."
---

A voice agent that can only talk is a chatbot with a mic and speakers. A voice agent that can call tools is an assistant. This is the single biggest jump you can make in capability.

## Why tools matter {#why-tools}

Without tools, your agent is limited to whatever the LLM already knows. It can talk about your company, but it can't look up an account. It can describe a calendar, but it can't book a meeting.

Tools let the model decide *"to answer this, I need to run a function and use the result."* You define the functions, Deepgram routes the call request back to you, you execute the function, send the result back, and the model integrates that result into its reply.

## Define the function {#define-the-function}

Functions live in your `think` settings under `functions`. Each function gets a name, a description (this is what the LLM reads to decide when to call it), a parameter schema in JSON Schema format, and a `client_side` flag.

```python
think = ThinkSettingsV1(
    provider=ThinkSettingsV1Provider_OpenAi(
        type="open_ai",
        model="gpt-4o-mini",
        temperature=0.7,
    ),
    prompt=(
        "You are a helpful AI assistant. Keep your responses brief. "
        "When the user asks for the current time, call the "
        "get_current_time function and read the result back to them."
    ),
    functions=[
        ThinkSettingsV1FunctionsItem(
            name="get_current_time",
            description="Returns the current local time as an ISO-8601 string.",
            parameters={
                "type": "object",
                "properties": {},
            },
            client_side=True,
        ),
    ],
)
```

A couple of details worth noting:

- The `description` matters. The LLM uses it to decide when to call the function — vague descriptions lead to either over-calling or under-calling.
- The `parameters` schema follows JSON Schema. For a no-argument function, an empty `properties` object is fine.
- `client_side=True` means *you* run the function. Deepgram will send you a `FunctionCallRequest` and wait for your response.

## Handle the call request {#handle-the-call}

Watch for `FunctionCallRequest` messages in your `on_message` handler. For each requested call, run the function and send back a `FunctionCallResponse`:

```python
from datetime import datetime
from deepgram.agent.v1.types import AgentV1SendFunctionCallResponse

# Inside on_message:
elif message_type == "FunctionCallRequest":
    for call in getattr(message, "functions", []):
        if call.name == "get_current_time":
            result = datetime.now().isoformat(timespec="seconds")
            print(f">> Tool call: {call.name}() -> {result}")
            agent.send_function_call_response(
                AgentV1SendFunctionCallResponse(
                    id=call.id,
                    name=call.name,
                    content=result,
                ),
            )
```

The model receives your `content` string as the function's return value and uses it to generate the spoken reply.

## Test it {#test-it}

Restart your agent and ask *"what time is it?"* You should see the agent's thinking event fire, then the tool-call log line print in your terminal, then the agent speak the time back to you.

If the function is being called too eagerly or not eagerly enough, the lever is the prompt. Tell the LLM more explicitly when to call the function — for example *"only call get_current_time if the user explicitly asks for the current time."*

## Going further {#going-further}

Once one function works, more is easy. A few directions to try:

- **Look up data:** call your own backend API to fetch user-specific info.
- **Take an action:** send a Slack message, create a calendar event, file a ticket.
- **Compose multiple tools:** a single conversation can call several functions in sequence.

You can also use `client_side=False` for built-in helpers if Deepgram exposes them for your use case, but the vast majority of real agents use client-side functions calling your own code.
