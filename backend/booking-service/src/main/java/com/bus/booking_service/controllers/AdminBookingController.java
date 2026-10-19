package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.admin.BookingActionRequestDto;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.services.AdminBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing super‑admin booking management endpoints. All endpoints are secured to users having the {@code SUPER_ADMIN} role.
 */
@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    /**
     * Retrieves a paginated and filterable list of all bookings. The request body follows the same
     * {@link com.bus.booking_service.dtos.BookingQueryDTO} used by the regular owner pagination endpoint.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/pagination")
    public ResponseEntity<ApiResponse<Object>> getAllBookings(@RequestBody com.bus.booking_service.dtos.BookingQueryDTO query) {
        var result = adminBookingService.getAllBookings(query);
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched", result, HttpStatus.OK.value()));
    }

    /**
     * Retrieves detailed information for a single booking.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getBooking(@PathVariable Long id) {
        Bookings booking = adminBookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking fetched", booking, HttpStatus.OK.value()));
    }

    /**
     * Approves a pending booking – changes its status to {@code CONFIRMED}.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveBooking(@PathVariable Long id) {
        adminBookingService.approveBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking approved", null, HttpStatus.OK.value()));
    }

    /**
     * Rejects a booking – changes its status to {@code CANCELLED}. The optional {@code reason} is currently not persisted but can be used
     * for audit logs.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectBooking(@PathVariable Long id, @RequestBody BookingActionRequestDto body) {
        adminBookingService.rejectBooking(id, body.getReason());
        return ResponseEntity.ok(ApiResponse.success("Booking rejected", null, HttpStatus.OK.value()));
    }
}
