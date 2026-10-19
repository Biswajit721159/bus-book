package com.booking.bus.controllers;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.services.CustomerRatingService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * CustomerReviewController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages post-trip passenger ratings and feedback:
 *
 * <ul>
 * <li>Submitting star ratings and written reviews for completed bus journeys
 * <li>Checking if a review has already been submitted for a specific booking
 * <li>Fetching paginated reviews for a specific bus
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> "Rate & Review" dialog on completed journey tickets & bus details page.
 * </ul>
 */
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class CustomerReviewController {
    private final CustomerRatingService customerRatingService;

    /**
     * Use: Submits customer rating (stars 1-5) and feedback comment for a specific completed booking. App: Passenger / User Web App (Review
     * & Rating Modal on completed journey tickets).
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addReview(@Valid @RequestBody PostReviewDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            throw new UnauthorizedException("User authentication required");
        }
        customerRatingService.saveRating(body, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review created successfully", null, HttpStatus.CREATED
                .value()));
    }

    /**
     * Use: Checks whether the logged-in user has already submitted a review for this booking. App: Passenger / User Web App (View Ticket
     * Details > conditional "Rate Trip" button).
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> isReviewExists(@PathVariable Long bookingId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            throw new UnauthorizedException("User authentication required");
        }
        CustomerReview customerReview = customerRatingService.getRating(bookingId, currentUser);
        Map<String, Object> map = new HashMap<>();
        map.put("status", customerReview != null);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Review exists", map, HttpStatus.OK.value()));
    }

    /**
     * Use: Fetches paginated reviews submitted for a specific bus. App: Passenger / User Web App (View Bus details page - Reviews & Ratings
     * tab).
     */
    @GetMapping("/bus/{busId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReviewsByBusId(@PathVariable Long busId,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size) {
        int pageIndex = Math.max(0, page - 1);
        int pageSize = Math.max(1, Math.min(size, 50));
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<CustomerReview> reviewPage = customerRatingService.getReviewsByBusId(busId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", reviewPage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", reviewPage.getTotalPages());
        response.put("totalElements", reviewPage.getTotalElements());
        response.put("size", reviewPage.getSize());

        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response, HttpStatus.OK.value()));
    }
}
