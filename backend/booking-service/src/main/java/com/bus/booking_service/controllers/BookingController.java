package com.bus.booking_service.controllers;
import com.bus.booking_service.dtos.BookingTicketResponseDTo;
import com.bus.booking_service.dtos.guestTicketResponseDTO;
import com.bus.booking_service.dtos.cancelTicketDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.dtos.BookingStatusRequestDTO;
import com.bus.booking_service.dtos.FrontendBookingDTO;
import com.bus.booking_service.dtos.BookingConfirmRequestDTO;
import com.bus.booking_service.services.SeatLockService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @Autowired
    SeatLockService seatLockService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> fetchBookings(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        List<BookingTicketResponseDTo> bookings = bookingService.fetchBookingData(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> fetchBooking(@PathVariable long id, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.fetchSeatByBookingId(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking successfully fetched", bookingTicketResponse, HttpStatus.OK.value()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelTicket(@RequestBody cancelTicketDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.updateCancelTicket(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket cancelled successfully", bookingTicketResponse, HttpStatus.OK.value()));
    }

    @GetMapping("/guest/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> getTicketByBookingIdForGuest(@PathVariable Long bookingId) {
        guestTicketResponseDTO booking = bookingService.fetchBookingDataForGuest(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", booking, HttpStatus.OK.value()));
    }

    @PostMapping("/pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingsPagination(@RequestBody BookingQueryDTO query, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        Map<String, Object> result = bookingService.fetchBookingsPagination(query, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", result, HttpStatus.OK.value()));
    }

    @PatchMapping("/getTicket/{pageNo}")
    public ResponseEntity<ApiResponse<List<FrontendBookingDTO>>> getBookingStatus(@PathVariable Integer pageNo, @RequestBody BookingStatusRequestDTO body) {
        LocalDateTime dateTime = LocalDateTime.parse(body.getDate() + "T00:00:00");
        List<FrontendBookingDTO> bookings = bookingService.getBookingStatus(body.getBus_id(), dateTime, pageNo);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmBooking(@RequestBody BookingConfirmRequestDTO body) {
        Map<String, Object> result = seatLockService.confirmBooking(body);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", result, HttpStatus.OK.value()));
    }
}
