package com.booking.bus.services;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.repository.CustomerReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomerRatingService {
    @Autowired
    private CustomerReviewRepository customerReviewRepository;

    public void saveRating(PostReviewDTO body, User user) {
        CustomerReview existingReview = customerReviewRepository.findByBookingId(body.getBookingId());

        if (existingReview != null) {
            throw new BadRequestException("Customer Review already exists");
        }

        CustomerReview customerReview = new CustomerReview();

        customerReview.setUser(user.getId());
        customerReview.setBookingId(body.getBookingId());
        customerReview.setRating(body.getRating());
        customerReview.setMessage(body.getMessage());

        customerReviewRepository.save(customerReview);
    }

    public CustomerReview getRating(Long bookingId, User user) {
        return customerReviewRepository.findByBookingIdAndUser(bookingId, user.getId());
    }
}
