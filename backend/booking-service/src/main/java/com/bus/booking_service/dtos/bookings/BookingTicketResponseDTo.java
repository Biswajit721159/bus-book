package com.bus.booking_service.dtos.bookings;

import com.bus.booking_service.dtos.bus.*;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.dtos.passenger.passengerMap;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingTicketResponseDTo {
    private Long id;
    private String pnrNumber;
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

    public BookingTicketResponseDTo(Bookings bookings, NormalUserBusResponseDto bus) {
        this.id = bookings.getId();
        this.pnrNumber = bookings.getPnrNumber();
        this.bus = bus != null ? new busDTO(bus) : null;

        this.sourceStation = bus != null ? new sourceStationDTO(bookings.getSourceStationId(), bus) : null;
        this.distStation = bus != null ? new distStationDTO(bookings.getDestinationStationId(), bus) : null;
        this.bookingDate = bookings.getBookingDate();
        this.totalAmount = bookings.getTotalAmount();
        this.status = bookings.getStatus();
        this.bookingTime = bookings.getCreatedAt();
        this.totalDistance = bus != null ? getTotalDistance(bus, bookings.getSourceStationId(), bookings.getDestinationStationId()) : 0;
    }

    public void setPassengerSeatMap(List<BookingSeats> seats, List<masterListResponseDTO> masterList) {
        Map<Long, masterListResponseDTO> masterListMap = new HashMap<>();
        if (masterList != null) {
            for (masterListResponseDTO masterListResponseDTO : masterList) {
                if (masterListResponseDTO != null && masterListResponseDTO.getId() != null) {
                    masterListMap.put(masterListResponseDTO.getId(), masterListResponseDTO);
                }
            }
        }
        if (seats != null) {
            for (BookingSeats seat : seats) {
                seatDetails.add(new passengerMap(seat, masterListMap.getOrDefault(seat.getPassengerId(), null)));
            }
        }
    }

    public void updateWishListedStatus(Boolean isWishlisted) {
        this.isWishlisted = isWishlisted;
    }

    public int getTotalDistance(NormalUserBusResponseDto bus, Long SourceStationId, Long destinationStationId) {
        if (bus == null || bus.getStations() == null || bus.getStations().isEmpty()) {
            return 0;
        }

        List<StationResponseDTO> sortedStations = bus.getStations().stream().sorted(Comparator.comparingInt(
                StationResponseDTO::getStationOrder)).toList();

        StationResponseDTO start = null;
        StationResponseDTO end = null;

        for (StationResponseDTO s : sortedStations) {
            if (s.getId().equals(SourceStationId)) {
                start = s;
            } else if (s.getId().equals(destinationStationId)) {
                end = s;
            }
        }

        // Fallbacks in case station names aren't matched exactly
        if (start == null && !sortedStations.isEmpty()) {
            start = sortedStations.getFirst();
        }
        if (end == null && !sortedStations.isEmpty()) {
            end = sortedStations.getLast();
        }
        int distance = 0;
        if (start != null && end != null) {
            int startOrder = start.getStationOrder();
            int endOrder = end.getStationOrder();
            for (StationResponseDTO s : sortedStations) {
                if (s.getStationOrder() > startOrder && s.getStationOrder() <= endOrder) {
                    distance += s.getDistanceFromLastStation();
                }
            }
        }
        return distance;
    }
}
