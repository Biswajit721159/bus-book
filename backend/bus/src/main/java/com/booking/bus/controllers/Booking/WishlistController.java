package com.booking.bus.controllers.Booking;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> add(@PathVariable Long bookingId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        wishlistService.create(bookingId, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("successfully added", null, HttpStatus.CREATED.value()));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long bookingId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        System.out.println(bookingId);
        wishlistService.remove(bookingId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("successfully remove", null, HttpStatus.OK.value()));
    }
}
