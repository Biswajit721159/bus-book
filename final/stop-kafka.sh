#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Bus Book — Stop Kafka & Kafka UI
# Usage: bash stop-kafka.sh
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Stopping Kafka & Kafka UI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$ROOT_DIR" || exit 1
docker compose down

echo "[✓] Kafka and Kafka UI containers stopped."
