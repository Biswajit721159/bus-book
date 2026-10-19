package com.bus.booking_service.config;

import com.bus.booking_service.dtos.bookings.BookingsResponse;
import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${app.cache.user-bookings.ttl:5m}")
    private Duration userBookingsTtl;

    @Value("${app.cache.bus-by-id.ttl:10m}")
    private Duration busByIdTtl;

    private ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);

        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer(createObjectMapper());
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper mapper = createObjectMapper();

        // Default Cache Configuration (Generic JSON Serializer fallback)
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer(
                        mapper))).disableCachingNullValues();

        // 1. userBookings Cache Configuration (BookingsResponse)
        Jackson2JsonRedisSerializer<BookingsResponse> userBookingsSerializer = new Jackson2JsonRedisSerializer<>(mapper,
                BookingsResponse.class);

        RedisCacheConfiguration userBookingsConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(userBookingsTtl)
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(userBookingsSerializer))
                .disableCachingNullValues();

        // 2. busById Cache Configuration (NormalUserBusResponseDto)
        Jackson2JsonRedisSerializer<NormalUserBusResponseDto> busByIdSerializer = new Jackson2JsonRedisSerializer<>(mapper,
                NormalUserBusResponseDto.class);

        RedisCacheConfiguration busByIdConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(busByIdTtl).serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())).serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(busByIdSerializer)).disableCachingNullValues();

        return RedisCacheManager.builder(connectionFactory).cacheDefaults(defaultCacheConfig).withCacheConfiguration("userBookings",
                userBookingsConfig).withCacheConfiguration("busById", busByIdConfig).build();
    }
}
