package com.bus.booking_service.repository;

import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.enums.SeatStatus;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingSeatRepository extends JpaRepository<BookingSeats, Long> {

    @Query("SELECT bs FROM BookingSeats bs WHERE bs.bookingId.id = :bookingId")
    List<BookingSeats> findSeatDetailsByBookingId(@Param("bookingId") Long bookingId);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("""
                UPDATE BookingSeats bs
                SET bs.status = :status
                WHERE bs.id IN :ids
            """)
    int updateSeatStatus(@Param("ids") List<Long> ids, @Param("status") SeatStatus status);
}
