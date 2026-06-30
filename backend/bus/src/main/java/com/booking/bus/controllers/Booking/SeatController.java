package com.booking.bus.controllers.Booking;

import com.booking.bus.dtos.Booking.CheckSeatCountRequestBodyDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.services.SeatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/seat")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @PostMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTotalSeat(@Valid @RequestBody CheckSeatCountRequestBodyDTO body) {
        int count = seatService.getFreeSeatCount(body);
        Map<String, Object> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(ApiResponse.success("Free seat count fetched successfully", result, HttpStatus.OK.value()));
    }

    @PostMapping("/seat-list")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSeatList(@Valid @RequestBody CheckSeatCountRequestBodyDTO body) {
        Map<String, Object> seatInfo = seatService.getSeatListInfo(body);
        return ResponseEntity.ok(ApiResponse.success("Seat list and info fetched successfully", seatInfo, HttpStatus.OK.value()));
    }
}
