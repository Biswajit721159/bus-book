package com.booking.bus.controllers;

import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    @Autowired
    private StationRepository stationRepository;

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<String>>> searchStation(){
        List<String> stations = stationRepository.findDistinctStationNames();
        return ResponseEntity.ok(ApiResponse.success("Stations fetched successfully", stations, HttpStatus.OK.value()));
    }
}
