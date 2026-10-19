package com.booking.bus.services;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.dtos.bus.BookingInternalDTO;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.internals.BookingApi;
import com.booking.bus.repository.CustomerReviewRepository;
import java.time.Duration;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
public class CustomerRatingService {

    private final CustomerReviewRepository customerReviewRepository;
    private final BookingApi bookingApi;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;

    CustomerRatingService(CustomerReviewRepository customerReviewRepository, BookingApi bookingApi,
            RedisTemplate<String, Object> redisTemplate, KafkaTemplate<String, String> kafkaTemplate) {
        this.customerReviewRepository = customerReviewRepository;
        this.bookingApi = bookingApi;
        this.redisTemplate = redisTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    //    @CacheEvict(value = "topTenBus", allEntries = true)
    public void saveRating(PostReviewDTO body, User user) {
        final Long bookingId = body.getBookingId();
        BookingInternalDTO booking = getCachedBooking(bookingId);
        if (booking == null) {
            booking = bookingApi.getBookings(body.getBookingId());
            if (booking == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking not found");
            }
            redisTemplate.opsForValue().set("booking::" + bookingId, booking, Duration.ofDays(1));
        }

        if (!booking.getCreatedBy().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        String redisKey = "review:lock:user:" + user.getId() + ":booking:" + booking.getId();
        Boolean isFirst = redisTemplate.opsForValue().setIfAbsent(redisKey, "LOCKED", Duration.ofDays(1));
        if (Boolean.FALSE.equals(isFirst)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Review already submitted for this booking.");
        }

        CustomerReview customerReview = new CustomerReview();
        customerReview.setUser(user.getId());
        customerReview.setBookingId(body.getBookingId());
        customerReview.setRating(body.getRating());
        customerReview.setMessage(body.getMessage());
        customerReview.setBusId(booking.getBusId());

        try {
            String jsonReview = objectMapper.writeValueAsString(customerReview);
            kafkaTemplate.send("bus-reviews-topic", String.valueOf(body.getBookingId()), jsonReview);
        } catch (Exception e) {
            redisTemplate.delete(redisKey);
            log.error("Failed to serialize or send customer review to Kafka", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to submit review");
        }
    }

    public CustomerReview getRating(Long bookingId, User user) {
        return customerReviewRepository.findByBookingIdAndUser(bookingId, user.getId());
    }

    public List<CustomerReview> getReviewsByBusId(Long busId) {
        return customerReviewRepository.findByBusIdOrderByIdDesc(busId);
    }

    public Page<CustomerReview> getReviewsByBusId(Long busId, Pageable pageable) {
        return customerReviewRepository.findByBusIdOrderByIdDesc(busId, pageable);
    }

    private BookingInternalDTO getCachedBooking(Long bookingId) {
        try {
            Object cached = redisTemplate.opsForValue().get("booking::" + bookingId);
            if (cached instanceof BookingInternalDTO) {
                return (BookingInternalDTO) cached;
            } else if (cached != null) {
                return objectMapper.convertValue(cached, BookingInternalDTO.class);
            }
        } catch (Exception e) {
            log.warn("Error converting cached booking for id: {}", bookingId, e);
        }
        return null;
    }
}
