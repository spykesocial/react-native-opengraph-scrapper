#!/bin/bash
# Install + build exactly like production. Prints PASS/FAIL + error tail.
# Usage: bash .engine/agents/build.sh
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
unset TURBOPACK || true

mkdir -p "$ROOT/.engine/agents/out"
LOG="$ROOT/.engine/agents/out/build-$(date +%s).log"

if [[ -f yarn.lock ]]; then PM=yarn; elif [[ -f pnpm-lock.yaml ]]; then PM=pnpm; else PM=npm; fi
echo "[build] package manager: $PM"
echo "[build] log: $LOG"

# Bound every step so a wedged package manager or build fails fast and visibly
# instead of hanging the agent tool call. Install (10min) + build (15min) stay
# under the engine's idle watchdog, so a legitimately long build never gets the
# session killed for being silent.
run_bounded() {
  local secs="$1"; shift
  if command -v timeout >/dev/null 2>&1; then
    timeout "$secs" "$@"
  else
    "$@"
  fi
}

# Dependencies MUST include devDependencies (typescript, tailwind plugins,
# @types/* live there). yarn/npm treat NODE_ENV=production (or the production
# config env) as "--production" and silently drop them, which surfaces later as
# "Cannot find module '@tailwindcss/postcss'" and friends. The install is
# therefore always forced out of production mode; the build below is the
# production one.
#
# NOTE: no --frozen-lockfile here on purpose. This is a mutable working tree,
# not CI: when package.json changed, the lockfile MUST be regenerated to match
# (the engine verifies the lockfile was updated). A frozen install would
# hard-fail exactly when the fix needs the lockfile rewritten.
if [[ "$PM" == "yarn" ]]; then
  INSTALL=(yarn install --production=false); BUILD=(yarn run build)
elif [[ "$PM" == "pnpm" ]]; then
  INSTALL=(pnpm install); BUILD=(pnpm run build)
else
  INSTALL=(npm install --production=false); BUILD=(npm run build)
fi

echo "[build] installing dependencies (devDependencies included, max 10min)..."
run_bounded 600 env NODE_ENV=development NPM_CONFIG_PRODUCTION=false npm_config_production=false "${INSTALL[@]}" >> "$LOG" 2>&1
CODE=$?
if [[ $CODE -ne 0 ]]; then
  if [[ $CODE -eq 124 ]]; then
    echo "INSTALL TIMED OUT after 600s — last 40 lines:"
  else
    echo "INSTALL FAILED — last 40 lines:"
  fi
  tail -n 40 "$LOG"
  exit 1
fi

echo "[build] running build (max 15min)..."
# SKIP_BUILD_TYPECHECK=1 marks this as a deploy build: production deploys skip
# the post-build typecheck (a PR-check gate), so the verification here matches
# exactly what production compiles — cold-cache type debt and cache artifacts
# never affect the deploy and only drown sessions in noise.
run_bounded 900 env NODE_ENV="${NODE_ENV:-production}" SKIP_BUILD_TYPECHECK=1 "${BUILD[@]}" >> "$LOG" 2>&1
CODE=$?
if [[ $CODE -eq 124 ]]; then
  echo "BUILD TIMED OUT after 900s — last 60 lines:"
  tail -n 60 "$LOG"
  exit 1
fi

# Same success heuristics as the engine's verifyBuild (post-build scripts such
# as CDN/deploy uploads often fail in temp environments and are tolerated).
if grep -qE "Compiled successfully|Build completed successfully|✓ Generating static pages|Finalizing page optimization" "$LOG"; then
  echo "BUILD PASS (compiled successfully)"
  exit 0
fi
if [[ $CODE -eq 0 ]]; then
  echo "BUILD PASS"
  exit 0
fi

echo "BUILD FAIL (exit $CODE) — last 60 lines:"
tail -n 60 "$LOG"
exit 1
