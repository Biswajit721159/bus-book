package com.booking.bus.services;

import com.booking.bus.dtos.Booking.CheckSeatCountRequestBodyDTO;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.repository.Booking.BookingSeatRepository;
import com.booking.bus.repository.BusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class SeatService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    private static class BusAndStationOrders {
        final Bus bus;
        final int sourceOrder;
        final int destOrder;

        BusAndStationOrders(Bus bus, int sourceOrder, int destOrder) {
            this.bus = bus;
            this.sourceOrder = sourceOrder;
            this.destOrder = destOrder;
        }
    }

    private BusAndStationOrders validateAndGetBusAndOrders(CheckSeatCountRequestBodyDTO body) {
        Bus bus = busRepository.findById(body.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        int sourceOrder = bus.getStations().stream()
                .filter(station -> station.getStationName().equalsIgnoreCase(body.getSource()))
                .map(Station::getStationOrder)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Source station not found on this bus"));

        int destOrder = bus.getStations().stream()
                .filter(station -> station.getStationName().equalsIgnoreCase(body.getDist()))
                .map(Station::getStationOrder)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Destination station not found on this bus"));

        return new BusAndStationOrders(bus, sourceOrder, destOrder);
    }

    public int getFreeSeatCount(CheckSeatCountRequestBodyDTO body) {
        log.info("Fetching free seat count for Bus: {} from '{}' to '{}'", body.getBusId(), body.getSource(), body.getDist());
        BusAndStationOrders orders = validateAndGetBusAndOrders(body);

        List<Integer> bookedSeats = bookingSeatRepository.fetchBookingSeat(
                orders.bus.getId(),
                body.getBookingDate(),
                orders.sourceOrder,
                orders.destOrder
        );

        return orders.bus.getTotalSeat() - bookedSeats.size();
    }

    public Map<String, Object> getSeatListInfo(CheckSeatCountRequestBodyDTO body) {
        log.info("Fetching seat list and distance for Bus: {} from '{}' to '{}'", body.getBusId(), body.getSource(), body.getDist());
        BusAndStationOrders orders = validateAndGetBusAndOrders(body);

        List<Integer> bookedSeatsList = bookingSeatRepository.fetchBookingSeat(
                orders.bus.getId(),
                body.getBookingDate(),
                orders.sourceOrder,
                orders.destOrder
        );

        Set<Integer> bookedSeatSet = new HashSet<>(bookedSeatsList);
        List<Map<String, Boolean>> seats = new ArrayList<>();
        int totalSeat = orders.bus.getTotalSeat();

        for (int i = 1; i <= totalSeat; i++) {
            Map<String, Boolean> seatInfo = new HashMap<>();
            seatInfo.put("isBooked", bookedSeatSet.contains(i));
            seats.add(seatInfo);
        }

        int totalDistance = 0;
        int startOrder = orders.sourceOrder;
        int endOrder = orders.destOrder;
        for (Station s : orders.bus.getStations()) {
            if (s.getStationOrder() > startOrder && s.getStationOrder() <= endOrder) {
                totalDistance += s.getDistanceFromLastStation();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("count", totalSeat - bookedSeatsList.size());
        result.put("seats", seats);
        result.put("totalDistance", totalDistance);
        return result;
    }
}
