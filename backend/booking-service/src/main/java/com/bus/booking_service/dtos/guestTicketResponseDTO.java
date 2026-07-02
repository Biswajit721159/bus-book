package com.bus.booking_service.dtos;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.BookingStatus;
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
        this.busName = "Bus #" + bookings.getBusId();
        this.totalDistance = 0;
        this.sourceStationName = "Station #" + bookings.getSourceStationId();
        this.distStationStationName = "Station #" + bookings.getDestinationStationId();
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