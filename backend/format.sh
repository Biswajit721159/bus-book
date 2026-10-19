#!/usr/bin/env bash
# ==============================================================================
# Script to format or check code across all backend microservices using Spotless
#
# Usage:
#   ./backend/format.sh apply    # Automatically formats all Java source code
#   ./backend/format.sh check    # Checks if all code adheres to format standards
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMAND="${1:-apply}"

if [[ "$COMMAND" != "apply" && "$COMMAND" != "check" ]]; then
    echo "Usage: $0 [apply|check]"
    exit 1
fi

SERVICES=("api-getway" "booking-service" "bus" "notifications" "payment" "users")

echo "================================================================="
echo "Running Spotless ${COMMAND} across all backend services..."
echo "================================================================="

FAILED_SERVICES=()

for svc in "${SERVICES[@]}"; do
    SVC_DIR="${SCRIPT_DIR}/${svc}"
    if [ -d "$SVC_DIR" ] && [ -f "$SVC_DIR/pom.xml" ]; then
        echo ""
        echo ">>> [${svc}] mvn spotless:${COMMAND} ..."
        if (cd "$SVC_DIR" && ./mvnw "spotless:${COMMAND}" -q); then
            echo "    ✓ [${svc}] Success"
        else
            echo "    ✗ [${svc}] Failed"
            FAILED_SERVICES+=("$svc")
        fi
    fi
done

echo ""
echo "================================================================="
if [ ${#FAILED_SERVICES[@]} -eq 0 ]; then
    echo "✓ All backend services completed spotless:${COMMAND} successfully!"
    echo "================================================================="
    exit 0
else
    echo "✗ The following services failed spotless:${COMMAND}:"
    for failed in "${FAILED_SERVICES[@]}"; do
        echo "  - $failed"
    done
    echo "================================================================="
    exit 1
fi
