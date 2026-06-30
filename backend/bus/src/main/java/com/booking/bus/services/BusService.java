package com.booking.bus.services;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.ConflictException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.repository.BusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Transactional
    @CacheEvict(value = "busSearch", allEntries = true)
    public BusResponseDTO addBus(BusRequestDTO body, User currentUser) {
        log.info("Adding bus: '{}' for owner: {}", body.getBusName(), currentUser.getEmail());
        if (busRepository.existsByBusNameAndCreatedByAndIsActiveTrue(body.getBusName(), currentUser.getId())) {
            throw new ConflictException("A bus with this name already exists for this owner");
        }

        Bus bus = Bus.builder()
                .busName(body.getBusName())
                .totalSeat(body.getTotalSeat())
                .createdBy(currentUser.getId())
                .build();

        List<Station> stations = new ArrayList<>();
        int stationOrder = 1;
        for (StationRequestDTO stationBody : body.getStations()) {
            stations.add(Station.builder()
                    .stationName(stationBody.getStationName())
                    .arrivalTime(stationBody.getArrivalTime())
                    .distanceFromLastStation(stationBody.getDistanceFromLastStation())
                    .stationOrder(stationOrder++)
                    .bus(bus)
                    .build());
        }

        bus.setStations(stations);
        Bus savedBus = busRepository.save(bus);
        return new BusResponseDTO(savedBus);
    }

    public List<BusResponseDTO> getBuses(User currentUser) {
        log.info("Fetching buses for owner: {}", currentUser.getEmail());
        return busRepository.findByCreatedByAndIsActiveTrue(currentUser.getId())
                .stream()
                .map(BusResponseDTO::new)
                .toList();
    }

    @Cacheable(value = "busById", key = "#id")
    public NormalUserBusResponseDto getBusById(Long id) {
        log.info("Fetching bus by ID: {}", id);
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        return new NormalUserBusResponseDto(bus);
    }

    @Cacheable(value = "busSearch", key = "#body.source + '-' + #body.dist")
    public List<BusSearchResponseDTO> searchBus(SearchBusByUserDTO body) {
        log.info("Searching buses from '{}' to '{}'", body.getSource(), body.getDist());
        String source = body.getSource();
        String dist = body.getDist();
        List<Bus> buses = busRepository.searchBus(source, dist);
        return buses.stream()
                .map(bus -> BusSearchResponseDTO.from(bus, source, dist))
                .toList();
    }
}
