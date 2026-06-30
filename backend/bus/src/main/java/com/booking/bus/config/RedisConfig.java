package com.booking.bus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;
import com.booking.bus.dtos.bus.NormalUserBusResponseDto;
import com.booking.bus.dtos.bus.BusSearchResponseDTO;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${app.cache.bus-search.ttl:10m}")
    private Duration busSearchTtl;

    @Value("${app.cache.bus-by-id.ttl:5m}")
    private Duration busByIdTtl;

    private ObjectMapper createObjectMapper() {
        return tools.jackson.databind.json.JsonMapper.builder()
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);
        
        // Use generic serializer for the template as it can hold arbitrary values
        GenericJacksonJsonRedisSerializer jsonRedisSerializer = new GenericJacksonJsonRedisSerializer(createObjectMapper());
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);
        
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper mapper = createObjectMapper();

        // Default config uses GenericJacksonJsonRedisSerializer as fallback
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJacksonJsonRedisSerializer(mapper)))
                .disableCachingNullValues();

        // 1. busById Cache Configuration (NormalUserBusResponseDto)
        JacksonJsonRedisSerializer<NormalUserBusResponseDto> busByIdSerializer = 
                new JacksonJsonRedisSerializer<NormalUserBusResponseDto>(mapper, NormalUserBusResponseDto.class);

        RedisCacheConfiguration busByIdConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(busByIdTtl)
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(busByIdSerializer))
                .disableCachingNullValues();

        // 2. busSearch Cache Configuration (List<BusSearchResponseDTO>)
        JavaType busSearchType = mapper.getTypeFactory().constructCollectionType(List.class, BusSearchResponseDTO.class);
        JacksonJsonRedisSerializer<List<BusSearchResponseDTO>> busSearchSerializer = 
                new JacksonJsonRedisSerializer<List<BusSearchResponseDTO>>(mapper, busSearchType);

        RedisCacheConfiguration busSearchConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(busSearchTtl)
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(busSearchSerializer))
                .disableCachingNullValues();

        // 3. stations Cache Configuration (List<String>)
        JavaType stationsType = mapper.getTypeFactory().constructCollectionType(List.class, String.class);
        JacksonJsonRedisSerializer<List<String>> stationsSerializer = 
                new JacksonJsonRedisSerializer<List<String>>(mapper, stationsType);

        RedisCacheConfiguration stationsConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(stationsSerializer))
                .disableCachingNullValues();

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultCacheConfig)
                .withCacheConfiguration("busSearch", busSearchConfig)
                .withCacheConfiguration("busById", busByIdConfig)
                .withCacheConfiguration("stations", stationsConfig)
                .build();
    }
}
