package com.bus.booking_service.repository;

import com.bus.booking_service.entities.SeatLocks;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface SeatLockRepository extends JpaRepository<SeatLocks, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM SeatLocks s WHERE s.expiresAt < :now")
    void deleteExpiredLocks(@Param("now") LocalDateTime now);

    @Modifying
    @Transactional
    @Query("DELETE FROM SeatLocks s WHERE s.createdBy = :userId")
    void deleteLocksByUserId(@Param("userId") Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<SeatLocks> findByCreatedBy(@Param("userId") Long userId);

    List<SeatLocks> findByBusIdAndBookingDateAndSeatNumberIn(Long busId, LocalDateTime bookingDate, List<Integer> seatNumbers);
}
