package com.bus.booking_service.services;

import com.bus.booking_service.dtos.CheckSeatCountRequestBodyDTO;
import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.bus.booking_service.dtos.bus.StationResponseDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.internals.busApi;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final busApi busApi;

    private Set<Integer> getBookedSeats(CheckSeatCountRequestBodyDTO body, NormalUserBusResponseDto busDetails) {
        StationResponseDTO sourceStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getSource())).findFirst().orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        StationResponseDTO destStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getDist())).findFirst().orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));

        int sourceOrder = sourceStation.getStationOrder();
        int destOrder = destStation.getStationOrder();

        Map<Long, Integer> stationOrderMap = busDetails.getStations().stream().collect(Collectors.toMap(StationResponseDTO::getId,
                StationResponseDTO::getStationOrder));

        LocalDateTime bookingDateTime = body.getBookingDate().atStartOfDay();
        List<Bookings> activeBookings = bookingRepository.findByBusIdAndDate(body.getBusId(), bookingDateTime);
        Set<Integer> bookedSeats = new HashSet<>();

        for (Bookings booking : activeBookings) {
            Integer bookedSourceOrder = stationOrderMap.get(booking.getSourceStationId());
            Integer bookedDestOrder = stationOrderMap.get(booking.getDestinationStationId());

            if (bookedSourceOrder != null && bookedDestOrder != null) {
                // If the booking route overlaps with the requested route:
                if (bookedSourceOrder < destOrder && bookedDestOrder > sourceOrder) {
                    List<BookingSeats> seats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
                    for (BookingSeats seat : seats) {
                        if (seat.getStatus() == SeatStatus.CONFIRMED) {
                            bookedSeats.add(seat.getSeatNumber());
                        }
                    }
                }
            }
        }
        return bookedSeats;
    }

    public int getFreeSeatCount(CheckSeatCountRequestBodyDTO body) {
        log.info("Fetching free seat count for Bus: {} from '{}' to '{}'", body.getBusId(), body.getSource(), body.getDist());
        NormalUserBusResponseDto busDetails = busApi.getBusById(body.getBusId());
        if (busDetails == null) {
            throw new ResourceNotFoundException("Bus not found");
        }

        Set<Integer> bookedSeats = getBookedSeats(body, busDetails);
        return busDetails.getTotalSeat() - bookedSeats.size();
    }

    public Map<String, Object> getSeatListInfo(CheckSeatCountRequestBodyDTO body) {
        log.info("Fetching seat list and distance for Bus: {} from '{}' to '{}'", body.getBusId(), body.getSource(), body.getDist());
        NormalUserBusResponseDto busDetails = busApi.getBusById(body.getBusId());
        if (busDetails == null) {
            throw new ResourceNotFoundException("Bus not found");
        }

        Set<Integer> bookedSeatSet = getBookedSeats(body, busDetails);
        List<Map<String, Boolean>> seats = new ArrayList<>();
        int totalSeat = busDetails.getTotalSeat();

        for (int i = 1; i <= totalSeat; i++) {
            Map<String, Boolean> seatInfo = new HashMap<>();
            seatInfo.put("isBooked", bookedSeatSet.contains(i));
            seats.add(seatInfo);
        }

        // Calculate total distance
        StationResponseDTO sourceStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getSource())).findFirst().orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        StationResponseDTO destStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getDist())).findFirst().orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));

        int startOrder = sourceStation.getStationOrder();
        int endOrder = destStation.getStationOrder();

        int totalDistance = 0;
        for (StationResponseDTO s : busDetails.getStations()) {
            if (s.getStationOrder() > startOrder && s.getStationOrder() <= endOrder) {
                totalDistance += s.getDistanceFromLastStation();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("count", totalSeat - bookedSeatSet.size());
        result.put("seats", seats);
        result.put("totalDistance", totalDistance);
        return result;
    }
}
