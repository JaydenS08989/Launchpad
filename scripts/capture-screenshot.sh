#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT="${1:-$ROOT/screenshots/title-screen.png}"
PORT="${PORT:-4173}"

browser="${CHROME_BIN:-}"
if [[ -z "$browser" ]]; then
  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then
      browser="$(command -v "$candidate")"
      break
    fi
  done
fi

if [[ -z "$browser" ]]; then
  echo "No Chromium-compatible browser found. Set CHROME_BIN to its executable." >&2
  exit 2
fi

mkdir -p "$(dirname "$OUTPUT")"
python3 -m http.server "$PORT" --directory "$ROOT" >/tmp/vice-horizon-http.log 2>&1 &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT

for _ in {1..40}; do
  curl -fsS "http://127.0.0.1:$PORT/" >/dev/null 2>&1 && break
  sleep 0.1
done

"$browser" \
  --headless=new \
  --no-sandbox \
  --disable-dev-shm-usage \
  --enable-unsafe-webgpu \
  --ignore-gpu-blocklist \
  --window-size=1600,900 \
  --virtual-time-budget=8000 \
  --screenshot="$OUTPUT" \
  "http://127.0.0.1:$PORT/"

test -s "$OUTPUT"
echo "Captured $OUTPUT"
