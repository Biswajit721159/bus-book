package com.booking.bus.repository.Booking;

import com.booking.bus.entities.Booking.SeatLocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SeatLockRepository extends JpaRepository<SeatLocks, Long> {
    @Modifying
    @Query("DELETE FROM SeatLocks s WHERE s.expiresAt < :now")
    void deleteExpiredLocks(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM SeatLocks s WHERE s.createdBy = :userId")
    void deleteLocksByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SeatLocks s WHERE s.createdBy = :userId")
    List<SeatLocks> findByCreatedById(Long userId);

    List<SeatLocks> findByBusIdAndBookingDateAndSeatNumberIn(Long busId, LocalDateTime bookingDate, List<Integer> seatNumbers);
}
