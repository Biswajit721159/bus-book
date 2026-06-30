package com.booking.bus.controllers;

import com.booking.bus.dtos.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

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
