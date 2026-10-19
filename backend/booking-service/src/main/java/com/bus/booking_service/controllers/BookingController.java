package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.BookingConfirmRequestDTO;
import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.dtos.BookingStatusRequestDTO;
import com.bus.booking_service.dtos.FrontendBookingDTO;
import com.bus.booking_service.dtos.bookings.BookingTicketResponseDTo;
import com.bus.booking_service.dtos.bookings.BookingsResponse;
import com.bus.booking_service.dtos.cancelTicketDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.dtos.guestTicketResponseDTO;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.services.BookingService;
import com.bus.booking_service.services.SeatLockService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * BookingController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages bus ticket reservations and booking lifecycles:
 *
 * <ul>
 * <li>Fetching user bookings with pagination
 * <li>Viewing individual booking and passenger seat details
 * <li>Cancelling tickets or specific seats
 * <li>Guest ticket verification (/api/booking/guest/{bookingId})
 * <li>Final booking confirmation (/api/booking/confirm)
 * <li>Admin & Bus Owner paginated search/filter (/api/booking/pagination)
 * <li>Internal inter-service booking lookup (/api/booking/internal/{bookingId})
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Viewing booking history, cancelling seats, confirming bookings.
 * <li><strong>Bus Owner & Super Admin Portal:</strong> Managing reservations and viewing passenger lists.
 * <li><strong>Guest Checkout Flow:</strong> Viewing guest booking confirmation.
 * <li><strong>Payment & Notification Services:</strong> Inter-service booking verification.
 * </ul>
 */
@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final SeatLockService seatLockService;

    /**
     * Use: Fetches paginated booking history with ticket and seat details for the logged-in regular passenger. App: Passenger / User Bus
     * Booking Web App ONLY (My Bookings / Last Transaction page).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> fetchBookings(Authentication authentication,
            @RequestParam(name = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(name = "wishList", defaultValue = "false") boolean wishList) {

        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        BookingsResponse bookings = bookingService.fetchBookingData(currentUser, pageNo, wishList);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    /**
     * Use: Confirms temporary locked seats and completes the booking transaction. App: Passenger / User Web App (Checkout & Payment
     * completion).
     */
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmBooking(@RequestBody BookingConfirmRequestDTO body) {
        Map<String, Object> result = seatLockService.confirmBooking(body);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", result, HttpStatus.OK.value()));
    }

    /**
     * Use: Fetches paginated fleet booking records for buses owned by the authenticated bus owner. App: Bus Owner App & Super Admin
     * Dashboard (Owner Fleet Bookings List).
     */
    @GetMapping("/owner")
    public ResponseEntity<ApiResponse<Object>> fetchOwnerBookings(Authentication authentication,
            @RequestParam(name = "pageNo", defaultValue = "1") int pageNo) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingsResponse bookings = bookingService.fetchOwnerBookingData(currentUser, pageNo);
        return ResponseEntity.ok(ApiResponse.success("Owner bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    /**
     * Use: Fetches complete details of a single booking by ID, including seat numbers, passenger info, and wishlist status. App: Passenger
     * / User Web App (View Ticket / Ticket Details page).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> fetchBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.fetchSeatByBookingId(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking successfully fetched", bookingTicketResponse, HttpStatus.OK.value()));
    }

    /**
     * Use: Cancels selected seat tickets or an entire booking if all seats are cancelled. App: Passenger / User Web App (View Ticket >
     * Cancel Seats Dialog).
     */
    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelTicket(@RequestBody cancelTicketDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        BookingTicketResponseDTo bookingTicketResponse = bookingService.updateCancelTicket(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket cancelled successfully", bookingTicketResponse, HttpStatus.OK.value()));
    }

    /**
     * Use: Retrieves booking and seat details for guest/unregistered users by booking ID. App: Guest Checkout / Guest Booking Confirmation
     * page.
     */
    @GetMapping("/guest/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> getTicketByBookingIdForGuest(@PathVariable Long bookingId) {
        guestTicketResponseDTO booking = bookingService.fetchBookingDataForGuest(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", booking, HttpStatus.OK.value()));
    }

    /** Use: Retrieves booking and seat details by 7-digit PNR. */
    @GetMapping("/pnr/{pnrNumber}")
    public ResponseEntity<ApiResponse<Object>> getTicketByPnr(@PathVariable String pnrNumber) {
        guestTicketResponseDTO booking = bookingService.fetchBookingDataForGuestByPnr(pnrNumber);
        return ResponseEntity.ok(ApiResponse.success("Booking successfully fetched", booking, HttpStatus.OK.value()));
    }

    /**
     * Use: Paginated and filtered search of all bookings (by passenger email, source, destination, bus name, date). App: Bus Owner Portal &
     * Super Admin Dashboard (Bookings Management).
     */
    @PostMapping("/pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingsPagination(@RequestBody BookingQueryDTO query,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        Map<String, Object> result = bookingService.fetchBookingsPagination(query, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", result, HttpStatus.OK.value()));
    }

    /**
     * Use: Retrieves confirmed passenger bookings for a specific bus on a given date. App: Bus Owner Portal (Daily Trip & Passenger
     * Manifest / Schedule).
     */
    @PatchMapping("/getTicket/{pageNo}")
    public ResponseEntity<ApiResponse<List<FrontendBookingDTO>>> getBookingStatus(@PathVariable Integer pageNo,
            @RequestBody BookingStatusRequestDTO body) {
        LocalDateTime dateTime = LocalDateTime.parse(body.getDate() + "T00:00:00");
        List<FrontendBookingDTO> bookings = bookingService.getBookingStatus(body.getBus_id(), dateTime, pageNo);
        return ResponseEntity.ok(ApiResponse.success("Bookings successfully fetched", bookings, HttpStatus.OK.value()));
    }

    /**
     * Use: Internal inter-service endpoint to retrieve raw Booking entity data. App: Internal Microservices (Bus Review, Notifications,
     * Payment Service).
     */
    @GetMapping("/internal/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> getBookingById(@PathVariable Long bookingId) {
        Bookings booking = bookingService.findById(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking successfully fetched", booking, HttpStatus.OK.value()));
    }
}
