package com.bus.booking_service.repository;

import com.bus.booking_service.entities.SeatLocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface SeatLockRepository extends JpaRepository<SeatLocks, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM SeatLocks s WHERE s.expiresAt < :now")
    void deleteExpiredLocks(@Param("now") LocalDateTime now);

    @Modifying
    @Transactional
    @Query("DELETE FROM SeatLocks s WHERE s.createdBy = :userId")
    void deleteLocksByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SeatLocks s WHERE s.createdBy = :userId")
    List<SeatLocks> findByCreatedById(@Param("userId") Long userId);

    List<SeatLocks> findByBusIdAndBookingDateAndSeatNumberIn(Long busId, LocalDateTime bookingDate, List<Integer> seatNumbers);
}
