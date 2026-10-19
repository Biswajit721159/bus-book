package com.booking.bus.services;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.entities.User;
import com.booking.bus.enums.BusStatus;
import com.booking.bus.enums.Role;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.ConflictException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.repository.BusRepository;

import java.util.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;

    private void validateRouteStations(List<StationRequestDTO> stations) {
        if (stations == null || stations.size() < 2) {
            throw new BadRequestException("A bus route must contain at least 2 stations (source and destination).");
        }
        if (stations.size() > 30) {
            throw new BadRequestException("A bus route cannot exceed 30 stations.");
        }

        Set<String> seenStations = new HashSet<>();
        for (int i = 0; i < stations.size(); i++) {
            StationRequestDTO st = stations.get(i);
            if (st.getStationName() == null || st.getStationName().trim().isEmpty()) {
                throw new BadRequestException("Station name cannot be blank at stop " + (i + 1));
            }
            String normalizedName = st.getStationName().trim().toLowerCase();
            if (!seenStations.add(normalizedName)) {
                throw new BadRequestException("Duplicate station '" + st.getStationName().trim() +
                        "' in route. Each station in a route must be unique.");
            }
            if (i == 0 && st.getDistanceFromLastStation() != 0) {
                throw new BadRequestException("The first station (origin) must have distance from last station equal to" + " 0.");
            }
        }
    }

    @Transactional
    @CacheEvict(value = {"busSearch", "topTenBus", "stations"}, allEntries = true)
    public BusResponseDTO addBus(BusRequestDTO body, User currentUser) {
        String trimmedBusName = body.getBusName().trim();
        log.info("Adding bus: '{}' for owner: {}", trimmedBusName, currentUser.getEmail());

        validateRouteStations(body.getStations());

        if (busRepository.existsByBusNameAndCreatedByAndIsActiveTrue(trimmedBusName, currentUser.getId())) {
            throw new ConflictException("A bus with this name already exists for this owner");
        }

        Bus bus = Bus.builder().busName(trimmedBusName).totalSeat(body.getTotalSeat()).createdBy(currentUser.getId()).build();

        List<Station> stations = new ArrayList<>();
        int stationOrder = 1;
        for (StationRequestDTO stationBody : body.getStations()) {
            stations.add(Station.builder().stationName(stationBody.getStationName().trim()).arrivalTime(stationBody.getArrivalTime())
                    .distanceFromLastStation(stationBody.getDistanceFromLastStation()).stationOrder(stationOrder++).status(bus.getStatus())
                    .bus(bus).build());
        }
        bus.setStations(stations);
        Bus savedBus = busRepository.save(bus);
        return new BusResponseDTO(savedBus);
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<Long> getBusIdsByOwner(Long ownerId) {
        return busRepository.findByCreatedByAndIsActiveTrue(ownerId).stream().map(Bus::getId).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBusesByFilter(BusFilterRequestDTO body, User currentUser) {
        log.info("Filtering buses for user: {}, role: {}", currentUser.getEmail(), currentUser.getRole());
        List<BusStatus> statuses = new ArrayList<>();
        if (body.isApproved())
            statuses.add(BusStatus.APPROVED);
        if (body.isPending())
            statuses.add(BusStatus.PENDING);
        if (body.isRejected())
            statuses.add(BusStatus.REJECTED);

        if (statuses.isEmpty()) {
            statuses.addAll(Arrays.asList(BusStatus.APPROVED, BusStatus.PENDING, BusStatus.REJECTED));
        }

        int pageIndex = Math.max(0, body.getPage() - 1);
        int pageSize = body.getSize() > 0 ? body.getSize() : 10;
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        Page<Bus> busPage;
        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            busPage = busRepository.findByStatusInAndIsActiveTrue(statuses, pageable);
        } else {
            busPage = busRepository.findByCreatedByAndStatusInAndIsActiveTrue(currentUser.getId(), statuses, pageable);
        }

        List<BusResponseDTO> mappedBuses = busPage.getContent().stream().map(BusResponseDTO::new).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("result", mappedBuses);
        response.put("totalPage", busPage.getTotalPages());
        response.put("totalElements", busPage.getTotalElements());
        response.put("currentPage", body.getPage());
        return response;
    }

    @Transactional(readOnly = true)
    public NormalUserBusResponseDto getBusById(Long id, User currentUser) {
        log.info("Fetching bus by ID: {}", id);
        Bus bus = busRepository.findById(id).filter(Bus::isActive).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (bus.getStatus() != BusStatus.APPROVED) {
            boolean isAuthorized = currentUser != null && (currentUser.getRole() == Role.SUPER_ADMIN || (currentUser.getId() != null &&
                    currentUser.getId().equals(bus.getCreatedBy())));
            if (!isAuthorized) {
                throw new ResourceNotFoundException("Bus not found");
            }
        }

        return new NormalUserBusResponseDto(bus);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "busSearch", key = "#body.source.trim().toLowerCase() + '-' + #body.dist.trim().toLowerCase()")
    public List<BusSearchResponseDTO> searchBus(SearchBusByUserDTO body) {
        String source = body.getSource() != null ? body.getSource().trim() : "";
        String dist = body.getDist() != null ? body.getDist().trim() : "";
        log.info("Searching buses from '{}' to '{}'", source, dist);
        List<Bus> buses = busRepository.searchBus(source, dist, BusStatus.APPROVED);
        return buses.stream().map(bus -> BusSearchResponseDTO.from(bus, source, dist)).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "topTenBus", key = "'topTen'")
    public List<BusSearchResponseDTO> getTopRatedBuses() {
        log.info("Get top 10 rated buses");
        List<Bus> buses = busRepository.getTopRated(BusStatus.APPROVED);
        return buses.stream().filter(bus -> bus.getStations() != null && !bus.getStations().isEmpty()).map(bus -> {
            List<Station> stations = bus.getStations();
            String source = stations.getFirst().getStationName();
            String destination = stations.getLast().getStationName();
            return BusSearchResponseDTO.from(bus, source, destination);
        }).toList();
    }

    @Transactional
    @CacheEvict(value = {"busSearch", "busById", "topTenBus", "stations"}, allEntries = true)
    public BusResponseDTO updateBus(Long id, BusRequestDTO body, User currentUser) {
        log.info("Updating bus ID: {} for user: {}", id, currentUser.getEmail());

        if (body.getStations() == null || body.getStations().isEmpty()) {
            throw new BadRequestException("Route stations cannot be empty");
        }
        validateRouteStations(body.getStations());

        Bus bus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (!bus.isActive()) {
            throw new BadRequestException("Cannot update an inactive or deleted bus");
        }

        if (currentUser.getRole() != Role.SUPER_ADMIN && !bus.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to update this bus");
        }

        String trimmedBusName = body.getBusName().trim();
        if (!trimmedBusName.equalsIgnoreCase(bus.getBusName()) && busRepository.existsByBusNameAndCreatedByAndIsActiveTrue(trimmedBusName,
                bus.getCreatedBy())) {
            throw new ConflictException("A bus with this name already exists for this owner");
        }

        bus.setBusName(trimmedBusName);
        bus.setTotalSeat(body.getTotalSeat());

        // Role-based status transition
        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            if (body.getStatus() != null && !body.getStatus().isBlank()) {
                try {
                    BusStatus newStatus = BusStatus.valueOf(body.getStatus().trim().toUpperCase());
                    bus.setStatus(newStatus);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid bus status: " + body.getStatus());
                }
            }
        } else {
            // Bus owner edits must reset status to PENDING for admin re-verification
            bus.setStatus(BusStatus.PENDING);
        }

        // In-place station list synchronization:
        // Preserves existing station IDs, avoids constraint collision on uk_station_bus_order,
        // and synchronizes all route stations.
        List<StationRequestDTO> incomingStations = body.getStations();
        List<Station> existingStations = bus.getStations();
        int existingCount = existingStations.size();
        int incomingCount = incomingStations.size();

        // 1. Update overlapping stations in-place
        int commonCount = Math.min(existingCount, incomingCount);
        for (int i = 0; i < commonCount; i++) {
            StationRequestDTO dto = incomingStations.get(i);
            Station existing = existingStations.get(i);
            existing.setStationName(dto.getStationName().trim());
            existing.setArrivalTime(dto.getArrivalTime());
            existing.setDistanceFromLastStation(dto.getDistanceFromLastStation());
            existing.setStationOrder(i + 1);
            existing.setStatus(bus.getStatus());
        }

        // 2. Add extra stations if incoming route is longer
        if (incomingCount > existingCount) {
            for (int i = existingCount; i < incomingCount; i++) {
                StationRequestDTO dto = incomingStations.get(i);
                Station newStation = Station.builder().stationName(dto.getStationName().trim()).arrivalTime(dto.getArrivalTime())
                        .distanceFromLastStation(dto.getDistanceFromLastStation()).stationOrder(i + 1).status(bus.getStatus()).bus(bus)
                        .build();
                bus.addStation(newStation);
            }
        }
        // 3. Remove tail stations if incoming route is shorter
        else if (incomingCount < existingCount) {
            while (bus.getStations().size() > incomingCount) {
                Station removed = bus.getStations().remove(bus.getStations().size() - 1);
                removed.setBus(null);
            }
        }

        Bus savedBus = busRepository.save(bus);
        return new BusResponseDTO(savedBus);
    }

    @Transactional
    @CacheEvict(value = {"busSearch", "busById", "topTenBus", "stations"}, allEntries = true)
    public void deleteBus(Long id, User currentUser) {
        log.info("Soft-deleting bus ID: {} for user: {}", id, currentUser.getEmail());
        Bus bus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (!bus.isActive()) {
            throw new BadRequestException("Bus is already deleted");
        }

        if (currentUser.getRole() != Role.SUPER_ADMIN && !bus.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this bus");
        }

        bus.setActive(false);
        busRepository.save(bus);
    }

    @Transactional(readOnly = true)
    public NormalUserBusResponseDto getBusByIdForInternals(Long busId) {
        Bus bus = busRepository.findByIdWithStations(busId).orElseThrow(() -> new ResourceNotFoundException("Bus not found with id " +
                busId));
        return new NormalUserBusResponseDto(bus);
    }
}
