package com.bus.booking_service.internals;

import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.dtos.internal.BusInternalDTO;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

@Slf4j
@Configuration
public class busApi {
    private final RestClient restClient;

    busApi(@Value("${bus.service.url}") String busUrl) {
        this.restClient = RestClient.builder().baseUrl(busUrl).build();
    }

    public List<Long> getBusIdsByOwner(Long ownerId) {
        try {
            return restClient.get().uri("/api/buses/internal/owner/" + ownerId).retrieve().body(
                    new ParameterizedTypeReference<List<Long>>() {
                    });
        } catch (Exception e) {
            log.error("Failed to fetch bus IDs for owner: {}", ownerId, e);
            return List.of();
        }
    }

    @Cacheable(value = "busById", key = "#id")
    public NormalUserBusResponseDto getBusById(Long id) {
        try {
            ApiResponse<NormalUserBusResponseDto> response = restClient.get().uri("/api/buses/internal/" + id).retrieve().body(
                    new ParameterizedTypeReference<ApiResponse<NormalUserBusResponseDto>>() {
                    });
            if (response == null || response.getData() == null) {
                throw new ResourceNotFoundException("Bus with id " + id + " not found");
            }
            return response.getData();
        } catch (Exception e) {
            log.error("Failed to fetch bus with id: {}", id, e);
            throw new ResourceNotFoundException("Bus with id " + id + " not found");
        }
    }

    public BusInternalDTO fetchBusDetailsInternal(Long busId) {
        try {
            ApiResponse<BusInternalDTO> response = restClient.get().uri("/api/buses/" + busId).retrieve().body(
                    new ParameterizedTypeReference<ApiResponse<BusInternalDTO>>() {
                    });
            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Failed to fetch details for bus ID: {}", busId, e);
            return null;
        }
    }
}
