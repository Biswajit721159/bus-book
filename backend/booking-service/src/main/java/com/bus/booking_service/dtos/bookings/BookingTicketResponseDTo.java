package com.bus.booking_service.dtos.bookings;

import com.bus.booking_service.dtos.bus.*;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.dtos.passenger.passengerMap;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.BookingStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

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

    public BookingTicketResponseDTo(Bookings bookings, NormalUserBusResponseDto bus) {
        this.id = bookings.getId();
        this.bus = new busDTO(bus);
        this.sourceStation = new sourceStationDTO(bookings.getSourceStationId(), bus);
        this.distStation = new distStationDTO(bookings.getDestinationStationId(), bus);
        this.bookingDate = bookings.getBookingDate();
        this.totalAmount = bookings.getTotalAmount();
        this.status = bookings.getStatus();
        this.bookingTime = bookings.getCreatedAt();
        this.totalDistance = getTotalDistance(bus,bookings.getSourceStationId(),bookings.getDestinationStationId()); // Decoupled from StationDistance helper
    }

    public void setPassengerSeatMap(List<BookingSeats> seats, List<masterListResponseDTO> masterList) {
        Map<Long, masterListResponseDTO> masterListMap = new HashMap<>();
        for (masterListResponseDTO masterListResponseDTO : masterList) {
            masterListMap.put(masterListResponseDTO.getId(), masterListResponseDTO);
        }
        for (BookingSeats seat : seats) {
            seatDetails.add(new passengerMap(seat, masterListMap.getOrDefault(seat.getPassengerId(), null)));
        }
    }

    public void updateWishListedStatus(Boolean isWishlisted) {
        this.isWishlisted = isWishlisted;
    }

    public int getTotalDistance(NormalUserBusResponseDto bus, Long SourceStationId, Long destinationStationId) {

        List<StationResponseDTO> sortedStations = bus
                .getStations()
                .stream()
                .sorted(Comparator.comparingInt(StationResponseDTO::getStationOrder))
                .toList();

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
