package com.bus.booking_service.internals;

import com.bus.booking_service.dtos.common.ApiResponse;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class userApi {
    private final RestClient restClient;

    userApi(@Value("${user.service.url}") String busUrl) {
        this.restClient = RestClient.builder().baseUrl(busUrl).build();
    }

    public List<masterListResponseDTO> fetchMasterListUsers(List<Long> ids) {
        try {
            String commaSeparatedIds = ids.stream().map(String::valueOf).collect(Collectors.joining(","));
            ApiResponse<List<masterListResponseDTO>> response = restClient.get().uri("/api/master-list/internal/" + commaSeparatedIds).retrieve().body(new ParameterizedTypeReference<ApiResponse<List<masterListResponseDTO>>>() {
            });

            if (response == null || response.getData() == null || response.getData().isEmpty()) {
                throw new ResourceNotFoundException("Users with ids " + ids + " not found");
            }
            return response.getData();
        } catch (Exception e) {
            System.out.println(e);
            throw new ResourceNotFoundException("master list users not found");
        }
    }
}
