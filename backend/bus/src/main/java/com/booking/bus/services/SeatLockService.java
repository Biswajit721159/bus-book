package com.booking.bus.services;

import com.booking.bus.dtos.Booking.TicketLockRequestBodyDTO;
import com.booking.bus.entities.Booking.SeatLocks;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.ConflictException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.repository.Booking.BookingSeatRepository;
import com.booking.bus.repository.Booking.SeatLockRepository;
import com.booking.bus.repository.BusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class SeatLockService {

    @Autowired
    private SeatLockRepository seatLockRepository;

    @Autowired
    private BookingSeatRepository seatRepository;

    @Autowired
    private BusRepository busRepository;

    @Value("${booking.lock.duration-minutes:10}")
    private int lockDurationMinutes;

    @Transactional
    public Map<String, Object> lockSeats(TicketLockRequestBodyDTO body, User currentUser) {
        log.info("Request to lock seats by user: {}", currentUser.getEmail());

        // 1. Validate inputs
        List<Long> passengerIds = body.getPassengerIds();
        List<Long> seatIds = body.getSeatIds();
        if (passengerIds == null || seatIds == null || passengerIds.isEmpty() || seatIds.isEmpty()) {
            throw new BadRequestException("Passenger IDs and Seat IDs must not be empty");
        }
        if (passengerIds.size() != seatIds.size()) {
            throw new BadRequestException("Number of passengers must match number of seats");
        }

        // 2. Find Bus
        Bus bus = busRepository.findById(body.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        // 3. Find and Validate stations on the bus
        int sourceOrder = bus.getStations().stream()
                .filter(station -> station.getStationName().equalsIgnoreCase(body.getSource()))
                .map(Station::getStationOrder)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        int destOrder = bus.getStations().stream()
                .filter(station -> station.getStationName().equalsIgnoreCase(body.getDist()))
                .map(Station::getStationOrder)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));

        Station sourceStation = bus.getStations().stream()
                .filter(station -> station.getStationName()
                        .equalsIgnoreCase(body.getSource())).findFirst()
                .orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        Station destinationStation = bus.getStations().stream()
                .filter(station -> station.getStationName().equalsIgnoreCase(body.getDist())).findFirst()
                .orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));


        // 4. Validate passengers
        List<Long> passengers = new ArrayList<>(passengerIds);

        // 5. Check if any requested seat is already booked
        List<Integer> bookedSeatsList = seatRepository.fetchBookingSeat(
                bus.getId(),
                body.getBookingDate(),
                sourceOrder,
                destOrder
        );
        Set<Integer> bookedSeats = new HashSet<>(bookedSeatsList);

        for (Long seatId : seatIds) {
            int seatNumber = seatId.intValue();
            if (bookedSeats.contains(seatNumber)) {
                throw new ConflictException("Seat " + seatNumber + " is already booked");
            }
        }

        // 6. Clean up expired locks first to ensure fresh conflict checks
        LocalDateTime now = LocalDateTime.now();
        seatLockRepository.deleteExpiredLocks(now);

        LocalDateTime bookingDateTime = body.getBookingDate().atStartOfDay();
        List<Integer> requestedSeats = seatIds.stream().map(Long::intValue).toList();

        // 7. Check if any active locks exist
        List<SeatLocks> activeLocks = seatLockRepository.findByBusIdAndBookingDateAndSeatNumberIn(
                bus.getId(),
                bookingDateTime,
                requestedSeats
        );

        if (!activeLocks.isEmpty()) {
            List<Integer> lockedSeats = activeLocks.stream().map(SeatLocks::getSeatNumber).toList();
            throw new ConflictException("Seats " + lockedSeats + " are already locked by another user");
        }
        seatLockRepository.deleteLocksByUserId(currentUser.getId());

        // 8. Save new locks
        LocalDateTime expiresAt = now.plusMinutes(lockDurationMinutes);
        List<Map<String, Object>> savedLocks = new ArrayList<>();

        for (int i = 0; i < seatIds.size(); i++) {
            int seatNumber = seatIds.get(i).intValue();
            Long passengerId = passengers.get(i);

            SeatLocks seatLock = SeatLocks.builder()
                    .createdBy(currentUser.getId())
                    .bus(bus)
                    .passengerId(passengerId)
                    .seatNumber(seatNumber)
                    .bookingDate(bookingDateTime)
                    .lockedAt(now)
                    .expiresAt(expiresAt)
                    .sourceStationId(sourceStation)
                    .destinationStationId(destinationStation)
                    .build();

            seatLockRepository.save(seatLock);

            Map<String, Object> lockInfo = new HashMap<>();
            lockInfo.put("seatNumber", seatNumber);
            lockInfo.put("passengerId", passengerId);
            lockInfo.put("passengerName", "Passenger #" + passengerId);
            savedLocks.add(lockInfo);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Seats locked successfully");
        result.put("expiresAt", expiresAt);
        result.put("locks", savedLocks);
        return result;
    }
}
