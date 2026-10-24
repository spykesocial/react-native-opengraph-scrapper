#!/bin/bash
# Web search from inside the repo. Usage: bash .engine/agents/research.sh "<query>"
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$DIR/research.mjs" "$@"
