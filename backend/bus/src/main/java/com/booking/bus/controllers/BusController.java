package com.booking.bus.controllers;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.BusService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@Tag(name = "Bus management endpoints")
public class BusController {

    @Autowired
    private BusService busService;

    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @PostMapping
    @CacheEvict(value = "stations", allEntries = true)
    public ResponseEntity<ApiResponse<BusResponseDTO>> addBus(
            @Valid @RequestBody BusRequestDTO body,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        BusResponseDTO savedBus = busService.addBus(body, currentUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bus created successfully", savedBus, HttpStatus.CREATED.value()));
    }

    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponseDTO>>> getBuses(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<BusResponseDTO> buses = busService.getBuses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Buses fetched successfully", buses, HttpStatus.OK.value()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NormalUserBusResponseDto>> getBusById(@PathVariable Long id) {
        NormalUserBusResponseDto busResponse = busService.getBusById(id);
        return ResponseEntity.ok(ApiResponse.success("Bus fetched successfully", busResponse, HttpStatus.OK.value()));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<BusSearchResponseDTO>>> searchBus(@RequestBody SearchBusByUserDTO body) {
        List<BusSearchResponseDTO> searchResults = busService.searchBus(body);
        return ResponseEntity.ok(ApiResponse.success("Buses searched successfully", searchResults, HttpStatus.OK.value()));
    }
}

