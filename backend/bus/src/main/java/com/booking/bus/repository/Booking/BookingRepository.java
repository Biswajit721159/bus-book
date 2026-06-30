package com.booking.bus.repository.Booking;

import com.booking.bus.entities.Booking.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Bookings, Long> {
    List<Bookings> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    Bookings findByIdAndCreatedBy(@Param("id") Long id, @Param("createdBy") Long createdBy);

}
