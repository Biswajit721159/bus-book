#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Bus Book — Start All Backend Services
# Usage: bash start-backend.sh
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/../backend"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Bus Book — Starting Backend Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kill any existing processes on our ports
echo "[1/5] Clearing old processes on ports 6005 8005 8006 8007 8080..."
lsof -ti :6005,8005,8006,8007,8080 | xargs kill -9 2>/dev/null || true
sleep 2

start_service() {
  local name="$1"
  local target_dir="${BACKEND_DIR}/$2"
  local log="/tmp/bus-${name}.log"

  echo "[+] Starting $name → logs: $log"
  # Run in subshell so working directory is unaffected
  (
    cd "$target_dir" || exit 1
    chmod +x mvnw 2>/dev/null || true
    nohup ./mvnw spring-boot:run -Dmaven.test.skip=true > "$log" 2>&1 &
    echo $! > "/tmp/bus-${name}.pid"
  )
}

start_service "users"    "users"
start_service "bus"      "bus"
start_service "booking"  "booking-service"
start_service "payment"  "payment"
start_service "gateway"  "api-getway"

echo ""
echo "[✓] All services launched. Wait ~30s for full startup."
echo ""
echo "  PORT  | SERVICE  | LOG"
echo "  ------|----------|-------------------------"
echo "  6005  | users    | /tmp/bus-users.log"
echo "  8005  | bus      | /tmp/bus-bus.log"
echo "  8006  | booking  | /tmp/bus-booking.log"
echo "  8007  | payment  | /tmp/bus-payment.log"
echo "  8080  | gateway  | /tmp/bus-gateway.log"
echo ""
echo "  Check: lsof -i :8080 | grep LISTEN"
