package com.booking.bus.dtos.Booking.GuestTicketResponse;
import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.enums.Booking.BookingStatus;
import com.booking.bus.utilities.StationDistance;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class guestTicketResponseDTO {
    private String busName;
    private int totalDistance;
    private String sourceStationName;
    private String distStationStationName;
    private LocalDateTime bookingDate;
    private LocalDateTime bookedAt;
    private BookingStatus bookingStatus;
    private List<SeatMapDTO> seatMap = new ArrayList<>();

    public guestTicketResponseDTO(Bookings bookings) {
        this.busName = bookings.getBus().getBusName();
        this.totalDistance = StationDistance.calculateDistance(bookings);
        this.sourceStationName = bookings.getSourceStationId().getStationName();
        this.distStationStationName = bookings.getSourceStationId().getStationName();
        this.bookingDate = bookings.getBookingDate();
        this.bookedAt = bookings.getCreatedAt();
        this.bookingStatus = bookings.getStatus();
    }

    public void updateBookingSeat(List<BookingSeats> bookingSeats) {
        for (BookingSeats bookingSeat : bookingSeats) {
            this.seatMap.add(new SeatMapDTO(bookingSeat));
        }
    }
}