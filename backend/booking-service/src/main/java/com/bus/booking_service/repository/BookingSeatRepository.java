package com.bus.booking_service.repository;

import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.SeatStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeats, Long> {
    @Query(value = """
            SELECT bs.seat_number
            FROM bookings b
            JOIN booking_seats bs ON b.id = bs.booking_id
            JOIN stations src ON b.source_station_id = src.id
            JOIN stations dest ON b.destination_station_id = dest.id
            WHERE b.bus_id = :busId
              AND b.booking_date = :bookingDate
              AND b.status = 'CONFIRMED'
              AND bs.status = 'CONFIRMED'
              AND src.station_order < :destOrder
              AND dest.station_order > :sourceOrder
            """, nativeQuery = true)
    List<Integer> fetchBookingSeat(@Param("busId") long busId, @Param("bookingDate") LocalDate bookingDate, @Param("sourceOrder") int sourceOrder, @Param("destOrder") int destOrder);

    @Query("SELECT bs FROM BookingSeats bs WHERE bs.bookingId.id = :bookingId")
    List<BookingSeats> findSeatDetailsByBookingId(@Param("bookingId") Long bookingId);

    List<BookingSeats> getByBookingIdAndCreatedBy(@Param("bookingId") Bookings id, @Param("createdBy") Long createdBy);
    List<BookingSeats> findAllByIdInAndCreatedBy(List<Long> ids, Long createdBy);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("""
        UPDATE BookingSeats bs
        SET bs.status = :status
        WHERE bs.id IN :ids
    """)
    int updateSeatStatus(@Param("ids") List<Long> ids,
                         @Param("status") SeatStatus status);
}
