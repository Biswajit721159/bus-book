package com.booking.bus;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;

import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

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

	@Test
	void clearAllCaches() {
		for (String cacheName : cacheManager.getCacheNames()) {
			if (cacheManager.getCache(cacheName) != null) {
				cacheManager.getCache(cacheName).clear();
			}
		}
	}
}
