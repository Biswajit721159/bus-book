package com.booking.bus.config;

import com.booking.bus.dtos.bus.BusSearchResponseDTO;
import com.booking.bus.dtos.bus.NormalUserBusResponseDto;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.Duration;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RedisConfig {

    @Value("${app.cache.bus-search.ttl:10m}")
    private Duration busSearchTtl;

    @Value("${app.cache.bus-by-id.ttl:5m}")
    private Duration busByIdTtl;

    @Value("${app.cache.top-ten-bus.ttl:10m}")
    private Duration topTenBusTtl;

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

        // Use generic serializer for the template as it can hold arbitrary values
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer(createObjectMapper());
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);

        template.afterPropertiesSet();
        log.info("redisTemplate:{}", template);
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper mapper = createObjectMapper();

        // Default config uses GenericJackson2JsonRedisSerializer as fallback
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer(
                        mapper))).disableCachingNullValues();

        // 1. busById Cache Configuration (NormalUserBusResponseDto)
        Jackson2JsonRedisSerializer<NormalUserBusResponseDto> busByIdSerializer = new Jackson2JsonRedisSerializer<>(mapper,
                NormalUserBusResponseDto.class);

        RedisCacheConfiguration busByIdConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(busByIdTtl).serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())).serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(busByIdSerializer)).disableCachingNullValues();

        // 2. busSearch Cache Configuration (List<BusSearchResponseDTO>)
        JavaType busSearchType = mapper.getTypeFactory().constructCollectionType(List.class, BusSearchResponseDTO.class);
        Jackson2JsonRedisSerializer<List<BusSearchResponseDTO>> busSearchSerializer = new Jackson2JsonRedisSerializer<>(mapper,
                busSearchType);

        RedisCacheConfiguration busSearchConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(busSearchTtl).serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())).serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(busSearchSerializer)).disableCachingNullValues();

        // 3. topTenBus Cache Configuration (List<BusSearchResponseDTO>)
        RedisCacheConfiguration topTenBusConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(topTenBusTtl).serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())).serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(busSearchSerializer)).disableCachingNullValues();

        // 4. stations Cache Configuration (List<String>)
        JavaType stationsType = mapper.getTypeFactory().constructCollectionType(List.class, String.class);
        Jackson2JsonRedisSerializer<List<String>> stationsSerializer = new Jackson2JsonRedisSerializer<>(mapper, stationsType);

        RedisCacheConfiguration stationsConfig = RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(stationsSerializer))
                .disableCachingNullValues();

        return RedisCacheManager.builder(connectionFactory).cacheDefaults(defaultCacheConfig).withCacheConfiguration("busSearch",
                busSearchConfig).withCacheConfiguration("busById", busByIdConfig).withCacheConfiguration("topTenBus", topTenBusConfig)
                .withCacheConfiguration("stations", stationsConfig).build();
    }
}
