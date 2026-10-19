package com.booking.bus.controllers;

import com.booking.bus.dtos.common.ApiResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HealthController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Provides health checks and dependency status monitoring:
 *
 * <ul>
 * <li>Checks overall service liveness and verifies Redis cache connectivity.
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>DevOps / Infrastructure / Monitoring Tools:</strong> Health probes, uptime monitors, Kubernetes/Docker liveness checks.
 * </ul>
 */
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Use: Checks application status and verifies Redis connectivity. App: Monitoring systems, DevOps health probes, and internal status
     * dashboards.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");

        try {
            redisTemplate.opsForValue().set("health-check-key", "OK");
            String redisStatus = (String) redisTemplate.opsForValue().get("health-check-key");
            if ("OK".equals(redisStatus)) {
                status.put("redis", "UP");
            } else {
                status.put("redis", "DOWN (Unexpected value)");
            }
        } catch (Exception e) {
            status.put("redis", "DOWN (" + e.getMessage() + ")");
        }

        return ResponseEntity.ok(ApiResponse.success("Health status fetched successfully", status, HttpStatus.OK.value()));
    }
}
