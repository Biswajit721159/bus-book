package com.booking.bus.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.booking.bus.dtos.bus.*;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import com.booking.bus.entities.User;
import com.booking.bus.enums.BusStatus;
import com.booking.bus.enums.Role;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.ConflictException;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.booking.bus.repository.BusRepository;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class BusServiceTest {

    @Mock
    private BusRepository busRepository;

    @InjectMocks
    private BusService busService;

    private User owner;
    private User superAdmin;
    private User passenger;

    @BeforeEach
    void setUp() {
        owner = User.builder().id(100L).email("owner@test.com").role(Role.BUS_OWNER).build();
        superAdmin = User.builder().id(1L).email("admin@test.com").role(Role.SUPER_ADMIN).build();
        passenger = User.builder().id(200L).email("passenger@test.com").role(Role.NORMAL_USER).build();
    }

    @Test
    @DisplayName("addBus throws BadRequestException if route has fewer than 2 stations")
    void testAddBusLessThanTwoStationsThrows() {
        BusRequestDTO dto = BusRequestDTO.builder().busName("Volvo AC").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build())).build();

        assertThatThrownBy(() -> busService.addBus(dto, owner)).isInstanceOf(BadRequestException.class).hasMessageContaining(
                "at least 2 stations");
    }

    @Test
    @DisplayName("addBus throws BadRequestException if first station distance is not 0")
    void testAddBusFirstStationDistanceNotZeroThrows() {
        BusRequestDTO dto = BusRequestDTO.builder().busName("Volvo AC").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(50).build(), StationRequestDTO.builder()
                        .stationName("Agra").arrivalTime(LocalTime.of(12, 0)).distanceFromLastStation(200).build())).build();

        assertThatThrownBy(() -> busService.addBus(dto, owner)).isInstanceOf(BadRequestException.class).hasMessageContaining(
                "origin) must have distance from last station equal to 0");
    }

    @Test
    @DisplayName("addBus throws BadRequestException if route has duplicate station names")
    void testAddBusDuplicateStationsThrows() {
        BusRequestDTO dto = BusRequestDTO.builder().busName("Volvo AC").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build(), StationRequestDTO.builder()
                        .stationName("delhi").arrivalTime(LocalTime.of(12, 0)).distanceFromLastStation(200).build())).build();

        assertThatThrownBy(() -> busService.addBus(dto, owner)).isInstanceOf(BadRequestException.class).hasMessageContaining(
                "Duplicate station");
    }

    @Test
    @DisplayName("addBus successfully creates bus with valid route")
    void testAddBusSuccess() {
        BusRequestDTO dto = BusRequestDTO.builder().busName("Volvo AC").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build(), StationRequestDTO.builder()
                        .stationName("Agra").arrivalTime(LocalTime.of(12, 0)).distanceFromLastStation(200).build())).build();

        when(busRepository.existsByBusNameAndCreatedByAndIsActiveTrue("Volvo AC", 100L)).thenReturn(false);
        when(busRepository.save(any(Bus.class))).thenAnswer(invocation -> {
            Bus b = invocation.getArgument(0);
            b.setId(1L);
            return b;
        });

        BusResponseDTO result = busService.addBus(dto, owner);
        assertThat(result).isNotNull();
        assertThat(result.getBusName()).isEqualTo("Volvo AC");
        assertThat(result.getStations()).hasSize(2);
    }

    @Test
    @DisplayName("getBusById allows owner and super admin to see non-approved bus, but hides from" + " passenger")
    void testGetBusByIdAccessControl() {
        Bus pendingBus = Bus.builder().id(50L).busName("Pending Shuttle").status(BusStatus.PENDING).isActive(true).createdBy(100L).stations(
                new ArrayList<>()).build();

        when(busRepository.findById(50L)).thenReturn(Optional.of(pendingBus));

        // Passenger should get 404 (Bus not found)
        assertThatThrownBy(() -> busService.getBusById(50L, passenger)).isInstanceOf(ResourceNotFoundException.class);

        // Anonymous user (null) should get 404
        assertThatThrownBy(() -> busService.getBusById(50L, null)).isInstanceOf(ResourceNotFoundException.class);

        // Owner can see their own pending bus
        NormalUserBusResponseDto ownerView = busService.getBusById(50L, owner);
        assertThat(ownerView).isNotNull();
        assertThat(ownerView.getBusName()).isEqualTo("Pending Shuttle");

        // Super admin can see pending bus
        NormalUserBusResponseDto adminView = busService.getBusById(50L, superAdmin);
        assertThat(adminView).isNotNull();
        assertThat(adminView.getBusName()).isEqualTo("Pending Shuttle");
    }

    @Test
    @DisplayName("getBusesByFilter performs pagination properly")
    void testGetBusesByFilterPagination() {
        BusFilterRequestDTO filterDTO = BusFilterRequestDTO.builder().page(1).size(5).approved(true).build();

        Bus bus1 = Bus.builder().id(1L).busName("Bus 1").status(BusStatus.APPROVED).stations(new ArrayList<>()).build();
        PageImpl<Bus> mockPage = new PageImpl<>(List.of(bus1), Pageable.ofSize(5), 11);

        when(busRepository.findByCreatedByAndStatusInAndIsActiveTrue(eq(100L), any(), any(Pageable.class))).thenReturn(mockPage);

        Map<String, Object> result = busService.getBusesByFilter(filterDTO, owner);
        assertThat(result).isNotNull();
        assertThat(result.get("totalElements")).isEqualTo(11L);
        assertThat(result.get("totalPage")).isEqualTo(3);
        assertThat(result.get("currentPage")).isEqualTo(1);
        assertThat((List<?>) result.get("result")).hasSize(1);
    }

    @Test
    @DisplayName("deleteBus performs soft delete by setting isActive to false")
    void testDeleteBusSoftDeletes() {
        Bus bus = Bus.builder().id(25L).busName("Active Bus").status(BusStatus.APPROVED).isActive(true).createdBy(100L).build();

        when(busRepository.findById(25L)).thenReturn(Optional.of(bus));

        busService.deleteBus(25L, owner);

        assertThat(bus.isActive()).isFalse();
        assertThat(bus.getStatus()).isEqualTo(BusStatus.APPROVED); // Should not become DELIVERED
        verify(busRepository, times(1)).save(bus);
    }

    @Test
    @DisplayName("updateBus throws BadRequestException if bus is inactive")
    void testUpdateBusInactiveThrows() {
        Bus bus = Bus.builder().id(25L).busName("Inactive Bus").isActive(false).createdBy(100L).build();
        when(busRepository.findById(25L)).thenReturn(Optional.of(bus));

        BusRequestDTO dto = BusRequestDTO.builder().busName("Updated Name").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build(), StationRequestDTO.builder()
                        .stationName("Jaipur").arrivalTime(LocalTime.of(13, 0)).distanceFromLastStation(250).build())).build();

        assertThatThrownBy(() -> busService.updateBus(25L, dto, owner)).isInstanceOf(BadRequestException.class).hasMessageContaining(
                "Cannot update an inactive or deleted bus");
    }

    @Test
    @DisplayName("updateBus throws ConflictException if renaming to existing active bus for owner")
    void testUpdateBusDuplicateNameThrows() {
        Bus bus = Bus.builder().id(25L).busName("Original Name").isActive(true).createdBy(100L).build();
        when(busRepository.findById(25L)).thenReturn(Optional.of(bus));
        when(busRepository.existsByBusNameAndCreatedByAndIsActiveTrue("Existing Other Bus", 100L)).thenReturn(true);

        BusRequestDTO dto = BusRequestDTO.builder().busName("Existing Other Bus").totalSeat(40).stations(List.of(StationRequestDTO.builder()
                .stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build(), StationRequestDTO.builder()
                        .stationName("Jaipur").arrivalTime(LocalTime.of(13, 0)).distanceFromLastStation(250).build())).build();

        assertThatThrownBy(() -> busService.updateBus(25L, dto, owner)).isInstanceOf(ConflictException.class).hasMessageContaining(
                "already exists for this owner");
    }

    @Test
    @DisplayName("updateBus by bus owner resets bus and station status to PENDING")
    void testUpdateBusByOwnerResetsToPending() {
        Station oldS1 = Station.builder().id(1L).stationName("Delhi").stationOrder(1).arrivalTime(LocalTime.of(8, 0)).build();
        Station oldS2 = Station.builder().id(2L).stationName("Agra").stationOrder(2).arrivalTime(LocalTime.of(12, 0)).build();
        List<Station> stations = new ArrayList<>(List.of(oldS1, oldS2));

        Bus bus = Bus.builder().id(25L).busName("Royal Express").status(BusStatus.APPROVED).isActive(true).createdBy(100L).stations(
                stations).build();

        when(busRepository.findById(25L)).thenReturn(Optional.of(bus));
        when(busRepository.save(any(Bus.class))).thenAnswer(i -> i.getArgument(0));

        BusRequestDTO dto = BusRequestDTO.builder().busName("Royal Express").totalSeat(45).status("APPROVED") // Owner tries to keep it APPROVED
                .stations(List.of(StationRequestDTO.builder().stationName("Delhi").arrivalTime(LocalTime.of(9, 0)).distanceFromLastStation(
                        0).build(), StationRequestDTO.builder().stationName("Agra").arrivalTime(LocalTime.of(13, 0))
                                .distanceFromLastStation(200).build())).build();

        BusResponseDTO result = busService.updateBus(25L, dto, owner);

        assertThat(result.getStatus()).isEqualTo(BusStatus.PENDING);
        assertThat(bus.getStations().get(0).getId()).isEqualTo(1L); // Preserves station ID!
        assertThat(bus.getStations().get(0).getArrivalTime()).isEqualTo(LocalTime.of(9, 0));
        assertThat(bus.getStations().get(0).getStatus()).isEqualTo(BusStatus.PENDING);
    }

    @Test
    @DisplayName("updateBus by super admin allows setting APPROVED status directly")
    void testUpdateBusBySuperAdminSetsApproved() {
        Station oldS1 = Station.builder().id(1L).stationName("Delhi").stationOrder(1).arrivalTime(LocalTime.of(8, 0)).build();
        Station oldS2 = Station.builder().id(2L).stationName("Agra").stationOrder(2).arrivalTime(LocalTime.of(12, 0)).build();
        List<Station> stations = new ArrayList<>(List.of(oldS1, oldS2));

        Bus bus = Bus.builder().id(25L).busName("Royal Express").status(BusStatus.PENDING).isActive(true).createdBy(100L).stations(stations)
                .build();

        when(busRepository.findById(25L)).thenReturn(Optional.of(bus));
        when(busRepository.save(any(Bus.class))).thenAnswer(i -> i.getArgument(0));

        BusRequestDTO dto = BusRequestDTO.builder().busName("Royal Express").totalSeat(45).status("APPROVED").stations(List.of(
                StationRequestDTO.builder().stationName("Delhi").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).build(),
                StationRequestDTO.builder().stationName("Agra").arrivalTime(LocalTime.of(12, 0)).distanceFromLastStation(200).build()))
                .build();

        BusResponseDTO result = busService.updateBus(25L, dto, superAdmin);

        assertThat(result.getStatus()).isEqualTo(BusStatus.APPROVED);
        assertThat(bus.getStations().get(0).getStatus()).isEqualTo(BusStatus.APPROVED);
    }
}
