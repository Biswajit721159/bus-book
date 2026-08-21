package com.booking.bus.controllers;
import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.dtos.bus.BookingInternalDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.Bookings;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.internals.BookingApi;
import com.booking.bus.services.CustomerRatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
public class CustomerReviewController {
    @Autowired
    CustomerRatingService customerRatingService;

    @Autowired
    BookingApi bookingApi;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addReview(@Valid @RequestBody PostReviewDTO body, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        BookingInternalDTO booking = bookingApi.getBookings(body.getBookingId());
        if (booking == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking not found");
        }
        customerRatingService.saveRating(body, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review created successfully", null, HttpStatus.CREATED.value()));
    }

    @GetMapping("/status/{bookingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> isReviewExists(@Valid @PathVariable Long bookingId, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }
        CustomerReview customerReview = customerRatingService.getRating(bookingId, currentUser);
        Map<String, Object> map = new HashMap<>();
        if (customerReview == null) {
            map.put("status", false);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Review exists", map, HttpStatus.OK.value()));
        }
        map.put("status", true);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Review exists", map, HttpStatus.OK.value()));
    }

}
