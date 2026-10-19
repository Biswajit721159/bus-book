package com.booking.bus.controllers;

import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.enums.BusStatus;
import com.booking.bus.repository.StationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * StationController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Provides location and station metadata queries:
 *
 * <ul>
 * <li>Retrieves distinct station names across all bus routes for autocomplete / dropdown selection.
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> "Source" and "Destination" autocomplete search inputs.
 * <li><strong>Bus Owner Portal:</strong> Station selection when defining new bus route stops.
 * </ul>
 */
@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {
    private final StationRepository stationRepository;

    /**
     * Use: Retrieves a distinct list of all station names across all existing routes. App: Passenger / User Web App (Search Form
     * Autocomplete) & Bus Owner Portal (Route Station dropdown).
     */
    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<String>>> searchStation() {
        List<String> stations = stationRepository.findDistinctStationNames(BusStatus.APPROVED);
        return ResponseEntity.ok(ApiResponse.success("Stations fetched successfully", stations, HttpStatus.OK.value()));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping("/search/src/{src}")
    public ResponseEntity<ApiResponse<List<String>>> searchBySrc(@RequestParam("src") String src) {
        List<String> stations = stationRepository.searchStationNamesBySrc(src);
        return ResponseEntity.ok(ApiResponse.success("Stations fetched successfully", stations, HttpStatus.OK.value()));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping("/search/dist/{dist}")
    public ResponseEntity<ApiResponse<List<String>>> searchByDist(@RequestParam("dist") String src) {
        List<String> stations = stationRepository.searchStationNamesBySrc(src);
        return ResponseEntity.ok(ApiResponse.success("Stations fetched successfully", stations, HttpStatus.OK.value()));
    }
}
