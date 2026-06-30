package com.booking.bus.services;

import com.booking.bus.dtos.Booking.PaymentRequestBodyDTO;
import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Booking.Payment;
import com.booking.bus.entities.Booking.SeatLocks;
import com.booking.bus.entities.User;
import com.booking.bus.enums.Booking.BookingStatus;
import com.booking.bus.enums.Booking.PaymentStatus;
import com.booking.bus.enums.Booking.SeatStatus;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.repository.Booking.BookingRepository;
import com.booking.bus.repository.Booking.BookingSeatRepository;
import com.booking.bus.repository.Booking.PaymentRepository;
import com.booking.bus.repository.Booking.SeatLockRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PaymentService {
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    SeatLockRepository seatLockRepository;
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    BookingSeatRepository bookingSeatRepository;
    @Autowired
    private KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Long createPayment(PaymentRequestBodyDTO body, User currentUser) {
        List<SeatLocks> seatLocks = seatLockRepository.findByCreatedById(currentUser.getId());
        if (seatLocks.isEmpty()) {
            throw new BadRequestException("No seats were found, or you are trying too late. Please refresh and reload the page.");
        }
        SeatLocks fastSeat = seatLocks.getFirst();
        Payment newPayment = new Payment();
        newPayment.setBusId(fastSeat.getBus());
        newPayment.setCreatedBy(currentUser.getId());
        newPayment.setCardNumber(body.getCardNumber());
        newPayment.setCardCvv(body.getCardCvv());
        newPayment.setCardHolderName(body.getCardHolderName());
        newPayment.setCardExpiryDate(body.getCardExpiryDate());
        newPayment.setTotalAmount(body.getTotalAmount());
        newPayment.setStatus(PaymentStatus.DONE);
        paymentRepository.save(newPayment);

        List<Long> passengerIds = seatLocks.stream()
                .map(SeatLocks::getPassengerId)
                .collect(Collectors.toList());

        List<Integer> seatNumbers = seatLocks.stream()
                .map(SeatLocks::getSeatNumber)
                .collect(Collectors.toList());

        Bookings newBooking = new Bookings();
        newBooking.setCreatedBy(currentUser.getId());
        newBooking.setBus(fastSeat.getBus());
        newBooking.setSourceStationId(fastSeat.getSourceStationId());
        newBooking.setDestinationStationId(fastSeat.getDestinationStationId());
        newBooking.setPaymentId(newPayment);
        newBooking.setBookingDate(fastSeat.getBookingDate());
        newBooking.setTotalAmount(BigDecimal.valueOf(200.100));
        newBooking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(newBooking);

        List<BookingSeats> savedSeats = new ArrayList<>();
        for (int i = 0; i < passengerIds.size(); i++) {
            Long passengerId = passengerIds.get(i);
            BookingSeats newSeat = BookingSeats.builder()
                    .createdBy(currentUser.getId())
                    .bookingId(newBooking)
                    .passengerId(passengerId)
                    .seatNumber(seatNumbers.get(i))
                    .status(SeatStatus.CONFIRMED)
                    .build();
            bookingSeatRepository.save(newSeat);
            savedSeats.add(newSeat);
        }

        try {
            String busName = newBooking.getBus().getBusName();
            String source = newBooking.getSourceStationId().getStationName();
            String destination = newBooking.getDestinationStationId().getStationName();
            String journeyDate = newBooking.getBookingDate().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

            StringBuilder sb = new StringBuilder();
            for (BookingSeats seat : savedSeats) {
                sb.append("<tr>")
                  .append("<td style=\"padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;\">")
                  .append("Passenger #").append(seat.getPassengerId())
                  .append("</td>")
                  .append("<td style=\"padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px; font-weight: 600;\">")
                  .append(seat.getSeatNumber())
                  .append("</td>")
                  .append("</tr>");
            }

            Map<String, Object> emailPayload = new HashMap<>();
            emailPayload.put("name", currentUser.getName());
            emailPayload.put("email", currentUser.getEmail());
            emailPayload.put("bookingId", newBooking.getId());
            emailPayload.put("busName", busName);
            emailPayload.put("source", source);
            emailPayload.put("destination", destination);
            emailPayload.put("journeyDate", journeyDate);
            emailPayload.put("amount", newBooking.getTotalAmount().toString());
            emailPayload.put("passengerSeatsHtml", sb.toString());

            String jsonMessage = objectMapper.writeValueAsString(emailPayload);
            kafkaProducerService.sendMessage("booking-email-topic", jsonMessage);
            log.info("Successfully published Booking email event to Kafka for booking: {}", newBooking.getId());
        } catch (Exception e) {
            log.error("Failed to publish booking email event to Kafka", e);
        }

        seatLockRepository.deleteLocksByUserId(currentUser.getId());
        seatLockRepository.deleteExpiredLocks(LocalDateTime.now());
        return newBooking.getId();
    }
}
