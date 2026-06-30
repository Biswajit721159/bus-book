package com.booking.bus.controllers.Booking;
import com.booking.bus.dtos.Booking.BookingTicketResponseDTo;
import com.booking.bus.dtos.Booking.GuestTicketResponse.guestTicketResponseDTO;
import com.booking.bus.dtos.Booking.cancelTicket.cancelTicketDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> fetchBookings(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        List<BookingTicketResponseDTo> bookings = bookingService.fetchBookingData(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> fetchBooking(@PathVariable long id, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.fetchSeatByBookingId(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking successfully fetched", bookingTicketResponse, HttpStatus.OK.value()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelTicket(@RequestBody cancelTicketDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.updateCancelTicket(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket cancelled successfully", bookingTicketResponse, HttpStatus.OK.value()));
    }

    @GetMapping("/guest/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> getTicketByBookingIdForGuest(@PathVariable Long bookingId) {
        guestTicketResponseDTO booking = bookingService.fetchBookingDataForGuest(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", booking, HttpStatus.OK.value()));
    }
}
