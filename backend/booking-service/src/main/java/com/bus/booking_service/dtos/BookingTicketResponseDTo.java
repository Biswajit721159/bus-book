package com.bus.booking_service.dtos;

import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.BookingStatus;
import lombok.Data;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
class busDTO {
    private final Long busId;
    private final String busName;

    public busDTO(Long busId) {
        this.busId = busId;
        this.busName = "Bus #" + busId; // Decoupled representation
    }
}

@Getter
class sourceStationDTO {
    private final Long sourceStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public sourceStationDTO(Long stationId) {
        this.sourceStationId = stationId;
        this.stationName = "Station #" + stationId;
        this.arrivalTime = LocalTime.MIDNIGHT;
    }
}

@Getter
class distStationDTO {
    private final Long distStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public distStationDTO(Long stationId) {
        this.distStationId = stationId;
        this.stationName = "Station #" + stationId;
        this.arrivalTime = LocalTime.MIDNIGHT;
    }
}

@Data
public class BookingTicketResponseDTo {
    private Long id;
    private busDTO bus;
    private sourceStationDTO sourceStation;
    private distStationDTO distStation;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime bookingTime;
    private int totalDistance;
    private List<passengerMap> seatDetails = new ArrayList<>();
    private Boolean isWishlisted = false;

    public BookingTicketResponseDTo(Bookings bookings) {
        this.id = bookings.getId();
        this.bus = new busDTO(bookings.getBusId());
        this.sourceStation = new sourceStationDTO(bookings.getSourceStationId());
        this.distStation = new distStationDTO(bookings.getDestinationStationId());
        this.bookingDate = bookings.getBookingDate();
        this.totalAmount = bookings.getTotalAmount();
        this.status = bookings.getStatus();
        this.bookingTime = bookings.getCreatedAt();
        this.totalDistance = 0; // Decoupled from StationDistance helper
    }

    public void setPassengerSeatMap(List<BookingSeats> seats) {
        for (BookingSeats seat : seats) {
            seatDetails.add(new passengerMap(seat));
        }
    }
    public void updateWishListedStatus(Boolean isWishlisted) {
        this.isWishlisted = isWishlisted;
    }

}
