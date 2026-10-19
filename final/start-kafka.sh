#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Bus Book — Start Kafka & Kafka UI
# Usage: bash start-kafka.sh
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Kafka & Kafka UI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check if Docker CLI is available
if ! command -v docker >/dev/null 2>&1; then
  echo "[!] Docker is not installed or not in PATH."
  echo "    Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
  exit 1
fi

# 2. Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
  echo "[+] Docker daemon is not running. Attempting to start Docker Desktop..."
  if [ -d "/Applications/Docker.app" ]; then
    open -a Docker
    echo "[+] Waiting for Docker daemon to become ready..."
    count=0
    while ! docker info >/dev/null 2>&1; do
      sleep 2
      count=$((count + 2))
      if [ $count -ge 60 ]; then
        echo "[!] Timed out waiting for Docker Desktop to start."
        echo "    Please start Docker Desktop manually and run this script again."
        exit 1
      fi
      printf "."
    done
    echo ""
    echo "[✓] Docker daemon is now running."
  else
    echo "[!] Docker Desktop not found in /Applications. Please start Docker manually."
    exit 1
  fi
fi

# 3. Clean up any stale or stopped containers that would cause naming conflicts
echo "[+] Cleaning up any conflicting containers..."
docker rm -f kafka-local kafka-ui kafka >/dev/null 2>&1 || true
cd "$ROOT_DIR" || exit 1
docker compose down >/dev/null 2>&1 || true

# 4. Start Kafka & Kafka-UI with Docker Compose
echo "[+] Launching Kafka and Kafka UI containers..."
docker compose up -d

# 4. Wait for Kafka broker port 9092 to be ready
echo "[+] Waiting for Kafka broker to listen on localhost:9092..."
ready=false
for i in {1..30}; do
  if nc -z localhost 9092 >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 1
  printf "."
done
echo ""

if [ "$ready" = true ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  [✓] Kafka is ready!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Broker Address : localhost:9092"
  echo "  Kafka UI       : http://localhost:8090"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "[!] Kafka container started, but port 9092 is not responding yet."
  echo "    Check logs with: docker logs -f kafka-local"
fi
