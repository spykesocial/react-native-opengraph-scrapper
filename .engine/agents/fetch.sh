#!/bin/bash
# Fetch a page as readable text. Usage: bash .engine/agents/fetch.sh <url> [maxChars]
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$DIR/fetch.mjs" "$@"
