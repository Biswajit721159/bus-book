package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.CheckSeatCountRequestBodyDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.services.SeatService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * SeatController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Provides seat availability queries and layout details for a specific bus route and travel date:
 *
 * <ul>
 * <li>Calculating available (free) seat count between source and destination stations
 * <li>Returning full seat map/list with status (booked, locked, free) and pricing info
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Bus seat layout selector screen during booking.
 * </ul>
 */
@RestController
@RequestMapping("/api/seat")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    /**
     * Use: Calculates available (free) seats on a bus for a given date and route segment. App: Passenger / User Web App (Bus Search Results
     * Card).
     */
    @PostMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTotalSeat(@Valid @RequestBody CheckSeatCountRequestBodyDTO body) {
        int count = seatService.getFreeSeatCount(body);
        Map<String, Object> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(ApiResponse.success("Free seat count fetched successfully", result, HttpStatus.OK.value()));
    }

    /**
     * Use: Retrieves full interactive seat map layout, showing free, booked, and locked seats with prices. App: Passenger / User Web App
     * (Seat Selection Modal / Screen).
     */
    @PostMapping("/seat-list")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSeatList(@Valid @RequestBody CheckSeatCountRequestBodyDTO body) {
        Map<String, Object> seatInfo = seatService.getSeatListInfo(body);
        return ResponseEntity.ok(ApiResponse.success("Seat list and info fetched successfully", seatInfo, HttpStatus.OK.value()));
    }
}
