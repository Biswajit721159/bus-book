package com.bus.booking_service.internals;

import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

@Slf4j
@Configuration
public class userApi {
    private final RestClient restClient;

    userApi(@Value("${user.service.url}") String userUrl) {
        this.restClient = RestClient.builder().baseUrl(userUrl).build();
    }

    public List<masterListResponseDTO> fetchMasterListUsers(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        List<Long> nonNullIds = ids.stream().filter(Objects::nonNull).distinct().toList();
        if (nonNullIds.isEmpty()) {
            return List.of();
        }

        try {
            String commaSeparatedIds = nonNullIds.stream().map(String::valueOf).collect(Collectors.joining(","));
            ApiResponse<List<masterListResponseDTO>> response = restClient.get().uri("/api/master-list/internal/" + commaSeparatedIds)
                    .retrieve().body(new ParameterizedTypeReference<ApiResponse<List<masterListResponseDTO>>>() {
                    });

            if (response == null || response.getData() == null) {
                return List.of();
            }
            return response.getData();
        } catch (Exception e) {
            log.warn("Could not fetch master list users for IDs: {}", nonNullIds, e);
            return List.of();
        }
    }
}
