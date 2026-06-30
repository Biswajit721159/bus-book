package com.booking.bus.controllers;
import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.CustomerRatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
public class CustomerReviewController {
    @Autowired
    CustomerRatingService customerRatingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addReview(@Valid @RequestBody PostReviewDTO body, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        customerRatingService.saveRating(body,currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Review created successfully",
                        null,
                        HttpStatus.CREATED.value()
                ));
    }

}
