#!/bin/bash
# Run this script to see how the project ACTUALLY builds in production.
# Usage: bash .engine-investigate.sh [command]
# Commands: build-config, env, logs, how-to-build, all (default)

CMD="${1:-all}"

echo "=== ENGINE INVESTIGATE: $CMD ==="
echo ""

if [[ "$CMD" == "build-config" || "$CMD" == "all" ]]; then
  echo "--- package.json scripts ---"
  cat package.json | node -e "
    const pkg = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    if(pkg.scripts) Object.entries(pkg.scripts).forEach(([k,v]) => console.log('  '+k+': '+v));
  " 2>/dev/null || echo "  (no scripts)"
  echo ""
  echo "--- package.json resolutions ---"
  cat package.json | node -e "
    const pkg = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    if(pkg.resolutions) Object.entries(pkg.resolutions).forEach(([k,v]) => console.log('  '+k+': '+v));
    if(pkg.overrides) Object.entries(pkg.overrides).forEach(([k,v]) => console.log('  '+k+' (override): '+v));
  " 2>/dev/null || echo "  (no resolutions)"
  echo ""
fi

if [[ "$CMD" == "env" || "$CMD" == "all" ]]; then
  echo "--- Current shell env (build-relevant) ---"
  env | grep -iE "TURBOPACK|NODE_ENV|CI|BUILD|NEXT|NPM|YARN|PNPM|SKIP|DOKPLOY" | sort || echo "  (none)"
  echo ""
fi

if [[ "$CMD" == "logs" || "$CMD" == "all" ]]; then
  echo "--- Last successful deployment build output ---"
  echo "(Check the deployment logs injected in the prompt above for the real build output)"
  echo ""
fi

if [[ "$CMD" == "how-to-build" || "$CMD" == "all" ]]; then
  echo "--- How to build this project ---"
  echo "1. First unset TURBOPACK (it conflicts with --webpack in the build script):"
  echo "   unset TURBOPACK"
  echo "2. Then run the build (use build:fast to skip typecheck):"
  echo "   yarn build:fast"
  echo "3. Or if you need the full build:"
  echo "   SKIP_BUILD_TYPECHECK=1 yarn build"
  echo ""
  echo "--- If ESLint crashes with 'expand is not a function' ---"
  echo "The general brace-expansion resolution forces v5.x onto minimatch 3.x which needs v1.x."
  echo "Fix: Remove the general 'brace-expansion' resolution, keep only the scoped ones."
  echo ""
fi

echo "=== DONE ==="
