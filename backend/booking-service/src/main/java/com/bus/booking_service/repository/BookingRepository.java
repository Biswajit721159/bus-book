package com.bus.booking_service.repository;

import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Bookings, Long> {
    Page<Bookings> findByCreatedByOrderByCreatedAtDesc(Long createdBy, Pageable pageable);

    @Query(value = "SELECT b FROM Bookings b WHERE b.createdBy = :userId AND b.id IN (SELECT" +
            " w.booking.id FROM Wishlist w WHERE w.user = :userId)", countQuery = "SELECT count(b) FROM Bookings b WHERE b.createdBy = :userId AND b.id IN" +
                    " (SELECT w.booking.id FROM Wishlist w WHERE w.user = :userId)")
    Page<Bookings> findWishlistedBookingsByUserId(@Param("userId") Long userId, Pageable pageable);

    Bookings findByIdAndCreatedBy(@Param("id") Long id, @Param("createdBy") Long createdBy);

    Page<Bookings> findByBusIdInOrderByCreatedAtDesc(List<Long> busIds, Pageable pageable);

    List<Bookings> findByBusIdInOrderByCreatedAtDesc(List<Long> busIds);

    Page<Bookings> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Bookings> findAllByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Bookings b WHERE b.busId = :busId AND DATE(b.bookingDate) = DATE(:date)" + " AND b.status = 'CONFIRMED'")
    List<Bookings> findByBusIdAndDate(@Param("busId") Long busId, @Param("date") LocalDateTime date);

    @Query("SELECT b FROM Bookings b WHERE b.busId = :busId AND DATE(b.bookingDate) = DATE(:date)" + " AND b.status = 'CONFIRMED'")
    org.springframework.data.domain.Page<Bookings> findByBusIdAndDate(@Param("busId") Long busId, @Param("date") LocalDateTime date,
            org.springframework.data.domain.Pageable pageable);

    @Query("""
                SELECT DISTINCT b
                FROM Bookings b
                LEFT JOIN FETCH b.seats s
                WHERE b.id = :id
                  AND b.createdBy = :createdBy
            """)
    java.util.Optional<Bookings> findBookingWithSeatsByIdAndCreatedBy(@Param("id") Long id, @Param("createdBy") Long createdBy);

    @Query("""
                SELECT DISTINCT b
                FROM Bookings b
                LEFT JOIN FETCH b.seats s
                WHERE b.pnrNumber = :pnrNumber
                  AND b.createdBy = :createdBy
            """)
    java.util.Optional<Bookings> findBookingWithSeatsByPnrNumberAndCreatedBy(@Param("pnrNumber") String pnrNumber,
            @Param("createdBy") Long createdBy);

    @Query("""
                SELECT bs
                FROM BookingSeats bs
                WHERE bs.bookingId.id = :bookingId
                  AND bs.createdBy = :createdBy
            """)
    List<BookingSeats> findSeatsByBookingIdAndCreatedBy(@Param("bookingId") Long bookingId, @Param("createdBy") Long createdBy);

    boolean existsByPnrNumber(String pnrNumber);

    java.util.Optional<Bookings> findByPnrNumber(String pnrNumber);
}
