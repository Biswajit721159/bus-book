package com.booking.bus.services;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.repository.CustomerReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
public class CustomerRatingService {
    @Autowired
    private CustomerReviewRepository customerReviewRepository;

    private final RestClient restClient;

    public CustomerRatingService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8006")
                .build();
    }

    @Transactional
    public void saveRating(@RequestBody PostReviewDTO body, User user) {
        log.info("Saving rating for user: {}, bookingId: {}", user.getEmail(), body.getBookingId());
        try {
            ApiResponse<Object> response = restClient.get()
                    .uri("/api/booking/" + body.getBookingId())
                    .header("X-User-Id", String.valueOf(user.getId()))
                    .header("X-User-Email", user.getEmail())
                    .header("X-User-Role", user.getRole().name())
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<Object>>() {});

            if (response == null || !response.isSuccess()) {
                throw new EntityNotFoundException("Booking not found or not owned by user");
            }
        } catch (Exception e) {
            throw new EntityNotFoundException("Booking verification failed: " + e.getMessage());
        }

        CustomerReview customerReview = CustomerReview
                .builder()
                .user(user.getId())
                .bookingId(body.getBookingId())
                .rating(body.getRating())
                .message(body.getMessage())
                .build();
        customerReviewRepository.save(customerReview);
    }
}
