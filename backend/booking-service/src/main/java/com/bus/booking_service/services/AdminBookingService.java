package com.bus.booking_service.services;

import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.BookingStatus;
import com.bus.booking_service.enums.Role;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Service providing super‑admin level booking management operations. All methods assume the caller has {@code SUPER_ADMIN} authority – the
 * controller enforces this.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminBookingService {

    private final BookingRepository bookingRepository;
    private final BookingService bookingService; // reuse existing pagination/filter logic

    private com.bus.booking_service.entities.User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.bus.booking_service.entities.User user) {
            return user;
        }
        throw new IllegalStateException("Authenticated user not found");
    }

    /**
     * Returns paginated and filtered bookings for super‑admin. Delegates to
     * {@link BookingService#fetchBookingsPagination(BookingQueryDTO, com.bus.booking_service.entities.User)} using the currently
     * authenticated super‑admin user.
     */
    public Map<String, Object> getAllBookings(BookingQueryDTO query) {
        com.bus.booking_service.entities.User admin = getCurrentUser();
        if (admin.getRole() != Role.SUPER_ADMIN) {
            log.warn("Non‑super‑admin attempted to access admin bookings: {}", admin.getEmail());
            throw new IllegalStateException("Insufficient permissions");
        }
        return bookingService.fetchBookingsPagination(query, admin);
    }

    /**
     * Retrieves raw booking entity by id.
     */
    public Bookings getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    /**
     * Approves a pending booking – sets status to {@link BookingStatus#CONFIRMED}.
     */
    @Transactional
    public void approveBooking(Long id) {
        Bookings booking = getBookingById(id);
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            log.info("Booking {} is already confirmed", id);
            return;
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        log.info("Booking {} approved by super admin", id);
    }

    /**
     * Rejects a booking – sets status to {@link BookingStatus#CANCELLED}. Optional {@code reason} is currently not persisted but could be
     * logged/audited.
     */
    @Transactional
    public void rejectBooking(Long id, String reason) {
        Bookings booking = getBookingById(id);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            log.info("Booking {} is already cancelled", id);
            return;
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking {} rejected by super admin. Reason: {}", id, reason);
    }
}
