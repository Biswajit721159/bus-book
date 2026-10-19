package com.bus.booking_service.services;

import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BookingCacheService {

    private final StringRedisTemplate redisTemplate;

    public BookingCacheService(@Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Evicts all cached booking pages exclusively for a specific user. Pattern matches keys like "userBookings::<userId>-<pageNo>".
     *
     * @param userId
     *            ID of the user whose booking cache should be invalidated
     */
    public void evictUserBookings(Long userId) {
        if (userId == null || redisTemplate == null) {
            return;
        }
        try {
            String pattern = "userBookings::" + userId + "-*";
            Set<String> keys = redisTemplate.keys(pattern);
            if (!keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("Evicted {} cache entries for user ID: {} (pattern: {})", keys.size(), userId, pattern);
            }
        } catch (Exception e) {
            log.error("Failed to evict user bookings cache for user ID: {}", userId, e);
        }
    }
}
