package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.TicketLockRequestBodyDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.services.SeatLockService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * SeatLockController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Handles temporary seat reservations (locks) during checkout:
 *
 * <ul>
 * <li>Temporarily locks selected seats for 10 minutes to prevent double-booking while the passenger enters details and makes payment.
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Triggered when the user selects seats and proceeds to checkout.
 * </ul>
 */
@RestController
@RequestMapping("/api/seatLock")
@RequiredArgsConstructor
public class SeatLockController {

    private final SeatLockService seatLockService;

    /**
     * Use: Temporarily locks chosen seats for 10 minutes to prevent race conditions while user fills passenger details and makes payment.
     * App: Passenger / User Web App (Seat Selection -> Proceed to Passenger Info).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> lockSeat(@Valid @RequestBody TicketLockRequestBodyDTO body,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        Map<String, Object> result = seatLockService.lockSeats(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Seats locked successfully", result, HttpStatus.OK.value()));
    }
}
