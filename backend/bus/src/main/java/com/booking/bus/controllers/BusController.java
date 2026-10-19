package com.booking.bus.controllers;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.services.BusService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * BusController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages bus fleet inventory, route searches, and bus details:
 *
 * <ul>
 * <li>Creating, updating, and deleting buses with intermediate route stations
 * <li>Searching available buses between source and destination stations
 * <li>Fetching top-rated buses for landing page recommendations
 * <li>Filtering buses by approval status (APPROVED, PENDING, REJECTED) for owners/admins
 * <li>Internal API for retrieving bus IDs by owner ID
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Searching buses, viewing bus route/schedule details, browsing top-rated buses.
 * <li><strong>Bus Owner Portal:</strong> Adding new buses, managing bus routes and stations, tracking approval status.
 * <li><strong>Super Admin Dashboard:</strong> Reviewing, approving/rejecting, and managing all registered buses.
 * <li><strong>Booking Microservice:</strong> Inter-service bus detail and owner validation queries.
 * </ul>
 */
@RestController
@RequestMapping("/api/buses")
@Tag(name = "Bus management endpoints")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User authentication required");
        }
        return user;
    }

    /**
     * Use: Registers a new bus with its route stations and total seat capacity. App: Bus Owner Portal (Add New Bus Form).
     */
    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponseDTO>> addBus(@Valid @RequestBody BusRequestDTO body, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        BusResponseDTO savedBus = busService.addBus(body, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Bus created successfully", savedBus, HttpStatus.CREATED
                .value()));
    }

    /**
     * Use: Retrieves the fleet of buses owned by the current bus owner (or all buses for super admin). App: Bus Owner Portal (My Buses
     * List) & Super Admin Dashboard.
     */
    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponseDTO>>> getBuses(Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        List<BusResponseDTO> buses = busService.getBuses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Buses fetched successfully", buses, HttpStatus.OK.value()));
    }

    /**
     * Use: Internal inter-service endpoint returning all bus IDs registered under a specific owner ID. App: Booking Microservice (Owner
     * fleet authorization & role filtering).
     */
    @GetMapping("/internal/owner/{ownerId}")
    public ResponseEntity<List<Long>> getBusIdsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(busService.getBusIdsByOwner(ownerId));
    }

    /**
     * Use: Fetches detailed public info for a bus (bus name, route stations, arrival times, total seats) by ID. App: Passenger / User Web
     * App (Bus Details / Booking Page).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NormalUserBusResponseDto>> getBusById(@PathVariable Long id, Authentication authentication) {
        User currentUser = authentication != null && authentication.getPrincipal() instanceof User user ? user : null;
        NormalUserBusResponseDto busResponse = busService.getBusById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bus fetched successfully", busResponse, HttpStatus.OK.value()));
    }

    /**
     * Use: Searches active buses travelling between source and destination stations. App: Passenger / User Web App (Search Buses / Home
     * Page search).
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<BusSearchResponseDTO>>> searchBus(@Valid @RequestBody SearchBusByUserDTO body) {
        List<BusSearchResponseDTO> searchResults = busService.searchBus(body);
        return ResponseEntity.ok(ApiResponse.success("Buses searched successfully", searchResults, HttpStatus.OK.value()));
    }

    /**
     * Use: Retrieves top 10 rated buses based on verified customer ratings. App: Passenger / User Web App (Home Page "Popular / Top Rated
     * Buses" Section).
     */
    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<BusSearchResponseDTO>>> getTopRatedBuses() {
        List<BusSearchResponseDTO> searchResults = busService.getTopRatedBuses();
        return ResponseEntity.ok(ApiResponse.success("Buses searched successfully", searchResults, HttpStatus.OK.value()));
    }

    /**
     * Use: Filters buses by status (APPROVED, PENDING, REJECTED). App: Bus Owner Portal & Super Admin Dashboard (Fleet Management Filter
     * Tabs).
     */
    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBusesByFilter(@Valid @RequestBody BusFilterRequestDTO body,
            Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        Map<String, Object> result = busService.getBusesByFilter(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Buses filtered successfully", result, HttpStatus.OK.value()));
    }

    /**
     * Use: Updates bus information and route stations. App: Bus Owner Portal (Edit Bus Modal/Page).
     */
    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponseDTO>> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequestDTO body,
            Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        BusResponseDTO updatedBus = busService.updateBus(id, body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", updatedBus, HttpStatus.OK.value()));
    }

    /**
     * Use: Soft deletes / deactivates a bus from the system. App: Bus Owner Portal (Delete Bus Action).
     */
    @PreAuthorize("hasAnyRole('BUS_OWNER', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        busService.deleteBus(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully", null, HttpStatus.OK.value()));
    }

    @GetMapping("/internal/{busId}")
    public ResponseEntity<ApiResponse<NormalUserBusResponseDto>> getBusByIdForInternals(@PathVariable Long busId) {
        NormalUserBusResponseDto bus = busService.getBusByIdForInternals(busId);
        return ResponseEntity.ok(ApiResponse.success("Bus fetched successfully", bus, HttpStatus.OK.value()));
    }

}
