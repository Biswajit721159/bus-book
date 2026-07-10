package com.booking.bus.services;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.entities.User;
import com.booking.bus.exceptions.ConflictException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.repository.BusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import com.booking.bus.enums.Role;
import com.booking.bus.enums.BusStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@Slf4j
@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Transactional
    @CacheEvict(value = {"busSearch", "topTenBus"}, allEntries = true)
    public BusResponseDTO addBus(BusRequestDTO body, User currentUser) {
        log.info("Adding bus: '{}' for owner: {}", body.getBusName(), currentUser.getEmail());
        if (busRepository.existsByBusNameAndCreatedByAndIsActiveTrue(body.getBusName(), currentUser.getId())) {
            throw new ConflictException("A bus with this name already exists for this owner");
        }

        Bus bus = Bus.builder().busName(body.getBusName()).totalSeat(body.getTotalSeat()).createdBy(currentUser.getId()).build();

        List<Station> stations = new ArrayList<>();
        int stationOrder = 1;
        for (StationRequestDTO stationBody : body.getStations()) {
            stations.add(Station.builder().stationName(stationBody.getStationName()).arrivalTime(stationBody.getArrivalTime()).distanceFromLastStation(stationBody.getDistanceFromLastStation()).stationOrder(stationOrder++).bus(bus).build());
        }

        bus.setStations(stations);
        Bus savedBus = busRepository.save(bus);
        return new BusResponseDTO(savedBus);
    }

    public List<BusResponseDTO> getBuses(User currentUser) {
        log.info("Fetching buses for user: {}, role: {}", currentUser.getEmail(), currentUser.getRole());
        List<Bus> buses;
        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            buses = busRepository.findByIsActiveTrue();
        } else {
            buses = busRepository.findByCreatedByAndIsActiveTrue(currentUser.getId());
        }
        return buses.stream().map(BusResponseDTO::new).toList();
    }

    public List<Long> getBusIdsByOwner(Long ownerId) {
        return busRepository.findByCreatedByAndIsActiveTrue(ownerId).stream().map(Bus::getId).toList();
    }

    public Map<String, Object> getBusesByFilter(BusFilterRequestDTO body, User currentUser) {
        log.info("Filtering buses for user: {}, role: {}", currentUser.getEmail(), currentUser.getRole());
        List<BusStatus> statuses = new ArrayList<>();
        if (body.isApproved()) statuses.add(BusStatus.APPROVED);
        if (body.isPending()) statuses.add(BusStatus.PENDING);
        if (body.isRejected()) statuses.add(BusStatus.REJECTED);

        if (statuses.isEmpty()) {
            statuses.addAll(Arrays.asList(BusStatus.APPROVED, BusStatus.PENDING, BusStatus.REJECTED));
        }

        List<Bus> buses;
        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            buses = busRepository.findByStatusInAndIsActiveTrue(statuses);
        } else {
            buses = busRepository.findByCreatedByAndStatusInAndIsActiveTrue(currentUser.getId(), statuses);
        }

        List<BusResponseDTO> mappedBuses = buses.stream().map(BusResponseDTO::new).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("result", mappedBuses);
        response.put("totalPage", 1);
        return response;
    }

    @Cacheable(value = "busById", key = "#id")
    public NormalUserBusResponseDto getBusById(Long id) {
        log.info("Fetching bus by ID: {}", id);
        Bus bus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        return new NormalUserBusResponseDto(bus);
    }

    @Cacheable(value = "busSearch", key = "#body.source + '-' + #body.dist")
    public List<BusSearchResponseDTO> searchBus(SearchBusByUserDTO body) {
        log.info("Searching buses from '{}' to '{}'", body.getSource(), body.getDist());
        String source = body.getSource();
        String dist = body.getDist();
        List<Bus> buses = busRepository.searchBus(source, dist);
        return buses.stream().map(bus -> BusSearchResponseDTO.from(bus, source, dist)).toList();
    }

    @Cacheable(value = "topTenBus", key = "'topTen'")
    public List<BusSearchResponseDTO> getTopRatedBuses() {
        log.info("Get top 10 rated buses");
        List<Bus> buses = busRepository.getTopRated();
        return buses.stream().map(bus -> {
            List<Station> stations = bus.getStations();
            String source = stations.getFirst().getStationName();
            String destination = stations.getLast().getStationName();
            return BusSearchResponseDTO.from(bus, source, destination);
        }).toList();
    }

    @Transactional
    @CacheEvict(value = {"busSearch", "busById"}, allEntries = true)
    public BusResponseDTO updateBus(Long id, BusRequestDTO body, User currentUser) {
        log.info("Updating bus ID: {} for user: {}", id, currentUser.getEmail());
        Bus bus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (currentUser.getRole() != Role.SUPER_ADMIN && !bus.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to update this bus");
        }

        bus.setBusName(body.getBusName());
        bus.setTotalSeat(body.getTotalSeat());

        if (body.getStatus() != null && currentUser.getRole() == Role.SUPER_ADMIN) {
            try {
                bus.setStatus(BusStatus.valueOf(body.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid bus status");
            }
        }

        // Update stations
        bus.getStations().clear();
        int stationOrder = 1;
        for (StationRequestDTO stationBody : body.getStations()) {
            bus.getStations().add(Station.builder().stationName(stationBody.getStationName()).arrivalTime(stationBody.getArrivalTime()).distanceFromLastStation(stationBody.getDistanceFromLastStation()).stationOrder(stationOrder++).bus(bus).build());
        }

        Bus savedBus = busRepository.save(bus);
        return new BusResponseDTO(savedBus);
    }

    @Transactional
    @CacheEvict(value = {"busSearch", "busById"}, allEntries = true)
    public void deleteBus(Long id, User currentUser) {
        log.info("Soft-deleting bus ID: {} for user: {}", id, currentUser.getEmail());
        Bus bus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (currentUser.getRole() != Role.SUPER_ADMIN && !bus.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this bus");
        }

        bus.setActive(false);
        busRepository.save(bus);
    }
}
