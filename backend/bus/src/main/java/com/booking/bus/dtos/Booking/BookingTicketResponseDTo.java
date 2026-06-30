package com.booking.bus.dtos.Booking;

import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.enums.Booking.BookingStatus;
import com.booking.bus.utilities.StationDistance;
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

    public busDTO(Bus bus) {
        this.busId = bus.getId();
        this.busName = bus.getBusName();
    }
}

@Getter
class sourceStationDTO {
    private final Long sourceStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public sourceStationDTO(Station station) {
        this.sourceStationId = station.getId();
        this.stationName = station.getStationName();
        this.arrivalTime = station.getArrivalTime();
    }
}

@Getter
class distStationDTO {
    private final Long distStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public distStationDTO(Station station) {
        this.distStationId = station.getId();
        this.stationName = station.getStationName();
        this.arrivalTime = station.getArrivalTime();
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
        this.bus = new busDTO(bookings.getBus());
        this.sourceStation = new sourceStationDTO(bookings.getSourceStationId());
        this.distStation = new distStationDTO(bookings.getDestinationStationId());
        this.bookingDate = bookings.getBookingDate();
        this.totalAmount = bookings.getTotalAmount();
        this.status = bookings.getStatus();
        this.bookingTime = bookings.getCreatedAt();
        this.totalDistance = StationDistance.calculateDistance(bookings);
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
