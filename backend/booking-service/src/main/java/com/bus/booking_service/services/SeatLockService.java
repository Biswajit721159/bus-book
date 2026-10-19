package com.bus.booking_service.services;

import com.bus.booking_service.dtos.BookingConfirmRequestDTO;
import com.bus.booking_service.dtos.TicketLockRequestBodyDTO;
import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.bus.booking_service.dtos.bus.StationResponseDTO;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.SeatLocks;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.enums.BookingStatus;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.ConflictException;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.internals.busApi;
import com.bus.booking_service.internals.userApi;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import com.bus.booking_service.repository.SeatLockRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatLockService {

    private final SeatLockRepository seatLockRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final busApi busApi;
    private final userApi userApi;
    private final BookingCacheService bookingCacheService;
    private final PnrGeneratorService pnrGeneratorService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

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

        // 2. Fetch Bus and Station details from Bus service
        NormalUserBusResponseDto busDetails = busApi.getBusById(body.getBusId());
        if (busDetails == null) {
            throw new ResourceNotFoundException("Bus not found");
        }

        // Map station name to order and ID
        StationResponseDTO sourceStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getSource())).findFirst().orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        StationResponseDTO destStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body
                .getDist())).findFirst().orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));

        int sourceOrder = sourceStation.getStationOrder();
        int destOrder = destStation.getStationOrder();

        // Create station mapping for quick lookup
        Map<Long, Integer> stationOrderMap = busDetails.getStations().stream().collect(Collectors.toMap(StationResponseDTO::getId,
                StationResponseDTO::getStationOrder));

        // 3. Check for existing booked seats (with station route overlap validation)
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

        for (Long seatId : seatIds) {
            int seatNumber = seatId.intValue();
            if (bookedSeats.contains(seatNumber)) {
                throw new ConflictException("Seat " + seatNumber + " is already booked");
            }
        }

        // 4. Clean up expired locks first to ensure fresh conflict checks
        LocalDateTime now = LocalDateTime.now();
        seatLockRepository.deleteExpiredLocks(now);

        List<Integer> requestedSeats = seatIds.stream().map(Long::intValue).toList();

        // 5. Check if any active locks exist on these seats
        List<SeatLocks> activeLocks = seatLockRepository.findByBusIdAndBookingDateAndSeatNumberIn(body.getBusId(), bookingDateTime,
                requestedSeats);

        if (!activeLocks.isEmpty()) {
            List<Integer> lockedSeats = activeLocks.stream().map(SeatLocks::getSeatNumber).toList();
            throw new ConflictException("Seats " + lockedSeats + " are already locked by another user");
        }

        // 6. Delete previous locks by this user
        seatLockRepository.deleteLocksByUserId(currentUser.getId());

        // 7. Save new locks
        LocalDateTime expiresAt = now.plusMinutes(lockDurationMinutes);
        List<Map<String, Object>> savedLocks = new ArrayList<>();

        for (int i = 0; i < seatIds.size(); i++) {
            int seatNumber = seatIds.get(i).intValue();
            Long passengerId = passengerIds.get(i);

            SeatLocks seatLock = SeatLocks.builder().createdBy(currentUser.getId()).busId(body.getBusId()).passengerId(passengerId)
                    .seatNumber(seatNumber).bookingDate(bookingDateTime).lockedAt(now).expiresAt(expiresAt).sourceStationId(sourceStation
                            .getId()).destinationStationId(destStation.getId()).build();

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

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredLocks() {
        log.debug("Cleaning up expired seat locks...");
        seatLockRepository.deleteExpiredLocks(LocalDateTime.now());
    }

    @Transactional
    public Map<String, Object> confirmBooking(BookingConfirmRequestDTO dto) {
        log.info("Confirming booking for user ID: {} with payment ID: {}", dto.getUserId(), dto.getPaymentId());

        // 1. Retrieve the active seat locks for this user
        List<SeatLocks> locks = seatLockRepository.findByCreatedBy(dto.getUserId());

        // Filter locks that have NOT expired
        LocalDateTime now = LocalDateTime.now();
        List<SeatLocks> activeLocks = locks.stream().filter(lock -> lock.getExpiresAt().isAfter(now)).toList();

        if (activeLocks.isEmpty()) {
            log.warn("No active seat locks found for user ID: {} during confirmation. Lock expired.", dto.getUserId());
            throw new ConflictException("Seat lock expired. Your payment has been refunded.");
        }

        // 2. Finalize the booking
        SeatLocks firstLock = activeLocks.getFirst();
        String pnr = pnrGeneratorService.generateUniqueRandomPnr();

        Bookings booking = Bookings.builder().createdBy(dto.getUserId()).busId(dto.getBusId()).sourceStationId(firstLock
                .getSourceStationId()).destinationStationId(firstLock.getDestinationStationId()).bookingDate(firstLock.getBookingDate())
                .totalAmount(dto.getTotalAmount()).paymentId(dto.getPaymentId()).pnrNumber(pnr).status(BookingStatus.CONFIRMED).isActive(
                        true).build();

        bookingRepository.save(booking);

        List<BookingSeats> savedSeats = new ArrayList<>();
        for (SeatLocks lock : activeLocks) {
            BookingSeats seat = BookingSeats.builder().createdBy(dto.getUserId()).bookingId(booking).passengerId(lock.getPassengerId())
                    .seatNumber(lock.getSeatNumber()).status(SeatStatus.CONFIRMED).build();

            bookingSeatRepository.save(seat);
            savedSeats.add(seat);
        }

        // 3. Delete locks
        seatLockRepository.deleteLocksByUserId(dto.getUserId());
        log.info("Booking finalized successfully. Ticket ID: {}, PNR: {}", booking.getId(), booking.getPnrNumber());

        // Evict cache only for this user
        bookingCacheService.evictUserBookings(dto.getUserId());

        // 4. Send booking confirmation email asynchronously via Kafka
        try {
            // Fetch Bus & Station details for the email body
            NormalUserBusResponseDto busDetails = busApi.getBusById(dto.getBusId());
            String busName = "Bus #" + dto.getBusId();
            String sourceName = "Station #" + firstLock.getSourceStationId();
            String destName = "Station #" + firstLock.getDestinationStationId();

            if (busDetails != null) {
                busName = busDetails.getBusName();
                if (busDetails.getStations() != null) {
                    for (StationResponseDTO st : busDetails.getStations()) {
                        if (st.getId().equals(firstLock.getSourceStationId())) {
                            sourceName = st.getStationName();
                        }
                        if (st.getId().equals(firstLock.getDestinationStationId())) {
                            destName = st.getStationName();
                        }
                    }
                }
            }

            Map<String, Object> emailEvent = new HashMap<>();
            emailEvent.put("name", dto.getUserName());
            emailEvent.put("email", dto.getUserEmail());
            emailEvent.put("bookingId", booking.getId());
            emailEvent.put("pnrNumber", booking.getPnrNumber());
            emailEvent.put("busName", busName);
            emailEvent.put("source", sourceName);
            emailEvent.put("destination", destName);
            emailEvent.put("journeyDate", firstLock.getBookingDate().toLocalDate().toString());
            emailEvent.put("amount", dto.getTotalAmount().toString());
            emailEvent.put("passengerSeatsHtml", buildPassengerSeatsHtml(savedSeats));

            String emailJson = objectMapper.writeValueAsString(emailEvent);
            kafkaTemplate.send("booking-email-topic", emailJson);
            log.info("Published booking confirmation email event: {}", emailJson);
        } catch (Exception e) {
            log.error("Failed to construct/publish booking confirmation email event", e);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("bookingId", booking.getId());
        response.put("pnrNumber", booking.getPnrNumber());
        return response;
    }

    String buildPassengerSeatsHtml(List<BookingSeats> seats) {
        Map<Long, String> passengerNames = new HashMap<>();
        List<Long> passengerIds = seats.stream().map(BookingSeats::getPassengerId).filter(Objects::nonNull).distinct().toList();

        if (!passengerIds.isEmpty()) {
            try {
                for (masterListResponseDTO passenger : userApi.fetchMasterListUsers(passengerIds)) {
                    passengerNames.put(passenger.getId(), passenger.getName());
                }
            } catch (Exception e) {
                log.warn("Could not resolve master-list passenger details for booking email", e);
            }
        }

        return seats.stream().map(seat -> {
            String name = passengerNames.getOrDefault(seat.getPassengerId(), "Passenger #" + seat.getPassengerId());
            return "<tr><td>" + HtmlUtils.htmlEscape(name) + "</td><td>" + seat.getSeatNumber() + "</td></tr>";
        }).collect(Collectors.joining());
    }
}
