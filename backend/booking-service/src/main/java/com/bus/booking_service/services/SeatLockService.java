package com.bus.booking_service.services;

import com.bus.booking_service.dtos.TicketLockRequestBodyDTO;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.SeatLocks;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.ConflictException;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import com.bus.booking_service.repository.SeatLockRepository;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import com.bus.booking_service.dtos.BookingConfirmRequestDTO;
import com.bus.booking_service.enums.BookingStatus;
import org.springframework.kafka.core.KafkaTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SeatLockService {

    @Autowired
    private SeatLockRepository seatLockRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Value("${booking.lock.duration-minutes:10}")
    private int lockDurationMinutes;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private final RestClient restClient = RestClient.builder().baseUrl("http://localhost:8005").build();

    @Data
    @NoArgsConstructor
    public static class BusDetailsDTO {
        private Long busId;
        private String busName;
        private int totalSeat;
        private List<StationDetailsDTO> stations;
    }

    @Data
    @NoArgsConstructor
    public static class StationDetailsDTO {
        private Long id;
        private String stationName;
        private int stationOrder;
    }

    private BusDetailsDTO fetchBusDetails(Long busId) {
        try {
            ApiResponse<BusDetailsDTO> response = restClient.get()
                    .uri("/api/buses/" + busId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<BusDetailsDTO>>() {
                    });
            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Failed to fetch details for bus ID: {}", busId, e);
            throw new ResourceNotFoundException("Bus details could not be retrieved from the bus service");
        }
    }

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
        BusDetailsDTO busDetails = fetchBusDetails(body.getBusId());
        if (busDetails == null) {
            throw new ResourceNotFoundException("Bus not found");
        }

        // Map station name to order and ID
        StationDetailsDTO sourceStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body.getSource())).findFirst().orElseThrow(() -> new BadRequestException("Source station not found on the bus"));

        StationDetailsDTO destStation = busDetails.getStations().stream().filter(st -> st.getStationName().equalsIgnoreCase(body.getDist())).findFirst().orElseThrow(() -> new BadRequestException("Destination station not found on the bus"));

        int sourceOrder = sourceStation.getStationOrder();
        int destOrder = destStation.getStationOrder();

        // Create station mapping for quick lookup
        Map<Long, Integer> stationOrderMap = busDetails.getStations().stream().collect(Collectors.toMap(StationDetailsDTO::getId, StationDetailsDTO::getStationOrder));

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
        List<SeatLocks> activeLocks = seatLockRepository.findByBusIdAndBookingDateAndSeatNumberIn(body.getBusId(), bookingDateTime, requestedSeats);

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

            SeatLocks seatLock = SeatLocks.builder().createdBy(currentUser.getId()).busId(body.getBusId()).passengerId(passengerId).seatNumber(seatNumber).bookingDate(bookingDateTime).lockedAt(now).expiresAt(expiresAt).sourceStationId(sourceStation.getId()).destinationStationId(destStation.getId()).build();

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
        List<SeatLocks> locks = seatLockRepository.findByCreatedById(dto.getUserId());

        // Filter locks that have NOT expired
        LocalDateTime now = LocalDateTime.now();
        List<SeatLocks> activeLocks = locks.stream().filter(lock -> lock.getExpiresAt().isAfter(now)).toList();

        if (activeLocks.isEmpty()) {
            log.warn("No active seat locks found for user ID: {} during confirmation. Lock expired.", dto.getUserId());
            throw new ConflictException("Seat lock expired. Your payment has been refunded.");
        }

        // 2. Finalize the booking
        SeatLocks firstLock = activeLocks.get(0);

        Bookings booking = Bookings.builder().createdBy(dto.getUserId()).busId(dto.getBusId()).sourceStationId(firstLock.getSourceStationId()).destinationStationId(firstLock.getDestinationStationId()).bookingDate(firstLock.getBookingDate()).totalAmount(dto.getTotalAmount()).paymentId(dto.getPaymentId()).status(BookingStatus.CONFIRMED).isActive(true).build();

        bookingRepository.save(booking);

        List<BookingSeats> savedSeats = new ArrayList<>();
        StringBuilder seatsHtmlBuilder = new StringBuilder("<ul>");
        for (SeatLocks lock : activeLocks) {
            BookingSeats seat = BookingSeats.builder().createdBy(dto.getUserId()).bookingId(booking).passengerId(lock.getPassengerId()).seatNumber(lock.getSeatNumber()).status(SeatStatus.CONFIRMED).build();

            bookingSeatRepository.save(seat);
            savedSeats.add(seat);
            seatsHtmlBuilder.append("<li>Seat ").append(lock.getSeatNumber()).append("</li>");
        }
        seatsHtmlBuilder.append("</ul>");

        // 3. Delete locks
        seatLockRepository.deleteLocksByUserId(dto.getUserId());
        log.info("Booking finalized successfully. Ticket ID: {}", booking.getId());

        // 4. Send booking confirmation email asynchronously via Kafka
        try {
            // Fetch Bus & Station details for the email body
            BusDetailsDTO busDetails = fetchBusDetails(dto.getBusId());
            String busName = "Bus #" + dto.getBusId();
            String sourceName = "Station #" + firstLock.getSourceStationId();
            String destName = "Station #" + firstLock.getDestinationStationId();

            if (busDetails != null) {
                busName = busDetails.getBusName();
                for (StationDetailsDTO st : busDetails.getStations()) {
                    if (st.getId().equals(firstLock.getSourceStationId())) {
                        sourceName = st.getStationName();
                    }
                    if (st.getId().equals(firstLock.getDestinationStationId())) {
                        destName = st.getStationName();
                    }
                }
            }

            Map<String, Object> emailEvent = new HashMap<>();
            emailEvent.put("name", dto.getUserName());
            emailEvent.put("email", dto.getUserEmail());
            emailEvent.put("bookingId", booking.getId());
            emailEvent.put("busName", busName);
            emailEvent.put("source", sourceName);
            emailEvent.put("destination", destName);
            emailEvent.put("journeyDate", firstLock.getBookingDate().toLocalDate().toString());
            emailEvent.put("amount", dto.getTotalAmount().toString());
            emailEvent.put("passengerSeatsHtml", seatsHtmlBuilder.toString());

            String emailJson = objectMapper.writeValueAsString(emailEvent);
            kafkaTemplate.send("booking-email-topic", emailJson);
            log.info("Published booking confirmation email event: {}", emailJson);
        } catch (Exception e) {
            log.error("Failed to construct/publish booking confirmation email event", e);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("bookingId", booking.getId());
        return response;
    }
}
