package com.bus.booking_service.controllers;

import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * WishlistController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages user bookmarking / saved journeys:
 *
 * <ul>
 * <li>Adding a booking/journey to user's saved wishlist favorites
 * <li>Removing a booking/journey from user's saved wishlist favorites
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> "Save Journey" / "Favourite Journey" toggle on ticket view and history.
 * </ul>
 */
@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    /**
     * Use: Adds a specific booking/journey to user's saved wishlist favorites. App: Passenger / User Web App (Ticket Details & Bookings
     * History > Heart Icon).
     */
    @PostMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> add(@PathVariable Long bookingId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        wishlistService.create(bookingId, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("successfully added", null, HttpStatus.CREATED.value()));
    }

    /**
     * Use: Removes a booking/journey from user's saved wishlist favorites. App: Passenger / User Web App (Saved Journeys / Wishlist Page >
     * Remove / Unheart).
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long bookingId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        wishlistService.remove(bookingId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("successfully remove", null, HttpStatus.OK.value()));
    }
}
