#!/bin/bash
# Run ONE worker agent on a focused task file and print its report.
# Usage: bash .engine/agents/delegate.sh <task-file> [model]
set -u

TASK_FILE="${1:-}"
MODEL="${2:-${ENGINE_WORKER_MODEL:-}}"
OPENCODE="${ENGINE_OPENCODE_BIN:-opencode}"

if [[ -z "$TASK_FILE" ]]; then
  echo "usage: delegate.sh <task-file> [model]" >&2
  exit 2
fi
if [[ ! -f "$TASK_FILE" ]]; then
  echo "delegate: task file not found: $TASK_FILE" >&2
  exit 2
fi
if [[ "${ENGINE_AGENT_DEPTH:-0}" -ge 1 ]]; then
  echo "delegate: depth limit reached — workers cannot delegate. Do the work yourself." >&2
  exit 3
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$ROOT/.engine/agents/out"
mkdir -p "$OUT_DIR"
STAMP="$(date +%s)-$$"
OUT="$OUT_DIR/worker-$STAMP.log"
REPORT="$OUT_DIR/worker-$STAMP.md"
MSG="$(mktemp)"

# Compose the worker message: shared worker rules (with report path) + the task.
awk -v report="$REPORT" -v taskfile="$TASK_FILE" '
  {
    if ($0 == "__TASK__") {
      print "## Your task"
      print ""
      while ((getline line < taskfile) > 0) print line
      close(taskfile)
    } else {
      gsub(/__REPORT_PATH__/, report)
      print
    }
  }
' "$ROOT/.engine/agents/worker-prompt.md" > "$MSG"

echo "[delegate] model=${MODEL:-default} task=$TASK_FILE"
echo "[delegate] log -> $OUT"

ARGS=(run --dir "$ROOT" --auto --print-logs)
if [[ -n "$MODEL" ]]; then
  ARGS+=(--model "$MODEL")
fi

export ENGINE_AGENT_DEPTH=$((${ENGINE_AGENT_DEPTH:-0} + 1))

if command -v timeout >/dev/null 2>&1; then
  timeout "${ENGINE_WORKER_TIMEOUT:-1200}" "$OPENCODE" "${ARGS[@]}" < "$MSG" > "$OUT" 2>&1
else
  "$OPENCODE" "${ARGS[@]}" < "$MSG" > "$OUT" 2>&1
fi
CODE=$?
rm -f "$MSG"

echo "[delegate] worker exited with code $CODE"
echo "===== worker report ====="
if [[ -s "$REPORT" ]]; then
  cat "$REPORT"
else
  echo "(no report file written — tail of the run:)"
  tail -n 60 "$OUT"
fi
echo "========================="
exit $CODE
