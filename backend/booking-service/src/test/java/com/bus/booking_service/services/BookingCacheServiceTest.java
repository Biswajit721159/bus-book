package com.bus.booking_service.services;

import static org.mockito.Mockito.*;

import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;

@ExtendWith(MockitoExtension.class)
class BookingCacheServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @InjectMocks
    private BookingCacheService bookingCacheService;

    @Test
    void evictUserBookingsDeletesMatchingKeys() {
        Long userId = 42L;
        String pattern = "userBookings::42-*";
        Set<String> keys = Set.of("userBookings::42-1", "userBookings::42-2");

        when(redisTemplate.keys(pattern)).thenReturn(keys);

        bookingCacheService.evictUserBookings(userId);

        verify(redisTemplate).keys(pattern);
        verify(redisTemplate).delete(keys);
    }

    @Test
    void evictUserBookingsDoesNothingWhenUserIdIsNull() {
        bookingCacheService.evictUserBookings(null);

        verifyNoInteractions(redisTemplate);
    }

    @Test
    void evictUserBookingsDoesNothingWhenNoKeysFound() {
        Long userId = 42L;
        String pattern = "userBookings::42-*";

        when(redisTemplate.keys(pattern)).thenReturn(Set.of());

        bookingCacheService.evictUserBookings(userId);

        verify(redisTemplate).keys(pattern);
        verify(redisTemplate, never()).delete(anySet());
    }
}
