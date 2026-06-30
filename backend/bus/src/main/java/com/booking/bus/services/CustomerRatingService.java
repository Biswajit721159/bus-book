package com.booking.bus.services;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.repository.Booking.BookingRepository;
import com.booking.bus.repository.CustomerReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class CustomerRatingService {
    @Autowired
    private CustomerReviewRepository customerReviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public void saveRating(@RequestBody PostReviewDTO body, User user) {
        Bookings booking = bookingRepository
                .findByIdAndCreatedBy(body.getBookingId(), user.getId());

        if (booking == null) {
            throw new EntityNotFoundException("Booking not found");
        }

        CustomerReview customerReview = CustomerReview
                .builder()
                .user(user.getId())
                .booking(booking)
                .rating(body.getRating())
                .message(body.getMessage())
                .build();
        customerReviewRepository.save(customerReview);
    }
}
