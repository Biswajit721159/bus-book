package com.booking.bus.repository;

import com.booking.bus.entities.CustomerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    CustomerReview findByBookingId(Long bookingId);

    CustomerReview findByBookingIdAndUser(Long bookingId, Long id);
}
