package com.booking.bus.controllers.Booking;

import com.booking.bus.dtos.Booking.TicketLockRequestBodyDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.SeatLockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/seatLock")
public class SeatLockController {

    @Autowired
    private SeatLockService seatLockService;

    @PostMapping()
    public ResponseEntity<ApiResponse<Map<String, Object>>> lockSeat(
            @Valid @RequestBody TicketLockRequestBodyDTO body,
            Authentication authentication
    ) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        User currentUser = (User) authentication.getPrincipal();
        Map<String, Object> result = seatLockService.lockSeats(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Seats locked successfully", result, HttpStatus.OK.value()));
    }
}
