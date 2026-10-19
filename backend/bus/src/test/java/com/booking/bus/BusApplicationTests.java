package com.booking.bus;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;

@SpringBootTest
class BusApplicationTests {

    @Autowired
    private CacheManager cacheManager;

    @Test
    void contextLoads() {
        assertThat(cacheManager).isNotNull();
    }

    @Test
    void testCacheConfigurations() {
        assertThat(cacheManager).isInstanceOf(RedisCacheManager.class);
        RedisCacheManager redisCacheManager = (RedisCacheManager) cacheManager;
        Map<String, RedisCacheConfiguration> cacheConfigs = redisCacheManager.getCacheConfigurations();

        assertThat(cacheConfigs).containsKey("busSearch");
        assertThat(cacheConfigs).containsKey("busById");

        assertThat(redisCacheManager.getCache("busSearch")).isNotNull();
        assertThat(redisCacheManager.getCache("busById")).isNotNull();
    }

    @Autowired
    private com.booking.bus.repository.StationRepository stationRepository;
    @Autowired
    private com.booking.bus.services.BusService busService;

    @Test
    void testFindDistinctStationNames() {
        java.util.List<String> stations = stationRepository.findDistinctStationNames(com.booking.bus.enums.BusStatus.APPROVED);
        assertThat(stations).isNotNull();
    }

    @Test
    void testTopRatedBuses() {
        java.util.List<com.booking.bus.dtos.bus.BusSearchResponseDTO> topRated = busService.getTopRatedBuses();
        System.out.println(">>> TOP RATED BUSES COUNT: " + topRated.size());
        assertThat(topRated).isNotEmpty();
    }

    @Test
    void clearAllCaches() {
        for (String cacheName : cacheManager.getCacheNames()) {
            if (cacheManager.getCache(cacheName) != null) {
                cacheManager.getCache(cacheName).clear();
            }
        }
    }
}
