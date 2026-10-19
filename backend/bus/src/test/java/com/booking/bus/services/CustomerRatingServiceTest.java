package com.booking.bus.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.booking.bus.dtos.Review.PostReviewDTO;
import com.booking.bus.dtos.bus.BookingInternalDTO;
import com.booking.bus.entities.CustomerReview;
import com.booking.bus.entities.User;
import com.booking.bus.enums.Role;
import com.booking.bus.internals.BookingApi;
import com.booking.bus.repository.CustomerReviewRepository;
import java.time.Duration;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CustomerRatingServiceTest {

    @Mock
    private CustomerReviewRepository customerReviewRepository;

    @Mock
    private BookingApi bookingApi;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    private CustomerRatingService customerRatingService;

    private User testUser;

    @BeforeEach
    void setUp() {
        customerRatingService = new CustomerRatingService(customerReviewRepository, bookingApi, redisTemplate, kafkaTemplate);
        testUser = User.builder().id(101L).email("user@test.com").role(Role.NORMAL_USER).build();
    }

    @Test
    @DisplayName("saveRating throws FORBIDDEN if user is not the booking creator")
    void testSaveRatingForbiddenWhenUserDoesNotMatch() {
        PostReviewDTO postReviewDTO = new PostReviewDTO();
        postReviewDTO.setBookingId(555L);
        postReviewDTO.setRating(5);
        postReviewDTO.setMessage("Great trip!");

        BookingInternalDTO booking = new BookingInternalDTO();
        booking.setId(555L);
        booking.setCreatedBy(999L); // Different user
        booking.setBusId(10L);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("booking::555")).thenReturn(booking);

        assertThatThrownBy(() -> customerRatingService.saveRating(postReviewDTO, testUser)).isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("saveRating throws CONFLICT if review is already submitted (Redis lock exists)")
    void testSaveRatingConflictWhenAlreadySubmitted() {
        PostReviewDTO postReviewDTO = new PostReviewDTO();
        postReviewDTO.setBookingId(555L);
        postReviewDTO.setRating(5);
        postReviewDTO.setMessage("Great trip!");

        BookingInternalDTO booking = new BookingInternalDTO();
        booking.setId(555L);
        booking.setCreatedBy(101L);
        booking.setBusId(10L);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("booking::555")).thenReturn(booking);
        when(valueOperations.setIfAbsent(eq("review:lock:user:101:booking:555"), eq("LOCKED"), any(Duration.class))).thenReturn(
                Boolean.FALSE);

        assertThatThrownBy(() -> customerRatingService.saveRating(postReviewDTO, testUser)).isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    @DisplayName("saveRating successfully publishes to Kafka when valid")
    void testSaveRatingSuccess() {
        PostReviewDTO postReviewDTO = new PostReviewDTO();
        postReviewDTO.setBookingId(555L);
        postReviewDTO.setRating(5);
        postReviewDTO.setMessage("Smooth ride!");

        BookingInternalDTO booking = new BookingInternalDTO();
        booking.setId(555L);
        booking.setCreatedBy(101L);
        booking.setBusId(10L);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("booking::555")).thenReturn(null);
        when(bookingApi.getBookings(555L)).thenReturn(booking);
        when(valueOperations.setIfAbsent(eq("review:lock:user:101:booking:555"), eq("LOCKED"), any(Duration.class))).thenReturn(
                Boolean.TRUE);

        customerRatingService.saveRating(postReviewDTO, testUser);

        verify(kafkaTemplate, times(1)).send(eq("bus-reviews-topic"), eq("555"), anyString());
    }

    @Test
    @DisplayName("getReviewsByBusId with pageable returns paginated reviews")
    void testGetReviewsByBusIdPageable() {
        CustomerReview r1 = CustomerReview.builder().id(1L).busId(10L).rating(5).message("Good").build();
        Page<CustomerReview> page = new PageImpl<>(List.of(r1), PageRequest.of(0, 5), 1);

        when(customerReviewRepository.findByBusIdOrderByIdDesc(eq(10L), any(PageRequest.class))).thenReturn(page);

        Page<CustomerReview> result = customerRatingService.getReviewsByBusId(10L, PageRequest.of(0, 5));
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1L);
    }
}
