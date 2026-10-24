# Agent toolkit

- `bash .engine/agents/delegate.sh <task-file> [model]` — one worker agent (opencode-go/mimo-v2.6-pro) on a focused task.
- `bash .engine/agents/research.sh "<query>"` — web search.
- `bash .engine/agents/fetch.sh <url>` — fetch a page as text.
- `bash .engine/agents/build.sh` — install + build, PASS/FAIL + error tail.
- `tasks/` — write one task file per worker here. `out/` — worker logs and reports.