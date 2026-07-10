package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.TicketLockRequestBodyDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.services.SeatLockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seatLock")
public class SeatLockController {

    @Autowired
    private SeatLockService seatLockService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> lockSeat(@Valid @RequestBody TicketLockRequestBodyDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        Map<String, Object> result = seatLockService.lockSeats(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Seats locked successfully", result, HttpStatus.OK.value()));
    }
}
