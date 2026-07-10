package com.bus.booking_service.repository;

import com.bus.booking_service.entities.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Bookings, Long> {
    List<Bookings> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    Bookings findByIdAndCreatedBy(@Param("id") Long id, @Param("createdBy") Long createdBy);
    List<Bookings> findByBusIdInOrderByCreatedAtDesc(List<Long> busIds);
    List<Bookings> findAllByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Bookings b WHERE b.busId = :busId AND DATE(b.bookingDate) = DATE(:date) AND b.status = 'CONFIRMED'")
    List<Bookings> findByBusIdAndDate(@Param("busId") Long busId, @Param("date") LocalDateTime date);

    @Query("SELECT b FROM Bookings b WHERE b.busId = :busId AND DATE(b.bookingDate) = DATE(:date) AND b.status = 'CONFIRMED'")
    org.springframework.data.domain.Page<Bookings> findByBusIdAndDate(@Param("busId") Long busId, @Param("date") LocalDateTime date, org.springframework.data.domain.Pageable pageable);
}
