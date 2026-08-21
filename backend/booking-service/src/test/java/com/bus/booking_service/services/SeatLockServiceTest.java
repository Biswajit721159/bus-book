package com.bus.booking_service.services;

import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.internals.userApi;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SeatLockServiceTest {

    @Mock
    private userApi userApi;

    @InjectMocks
    private SeatLockService seatLockService;

    @Test
    void buildPassengerSeatsHtmlIncludesMasterListPassengerNames() {
        masterListResponseDTO firstPassenger = new masterListResponseDTO();
        firstPassenger.setId(101L);
        firstPassenger.setName("Asha Patel");
        masterListResponseDTO secondPassenger = new masterListResponseDTO();
        secondPassenger.setId(102L);
        secondPassenger.setName("Ravi Kumar");
        when(userApi.fetchMasterListUsers(List.of(101L, 102L)))
                .thenReturn(List.of(firstPassenger, secondPassenger));

        String html = seatLockService.buildPassengerSeatsHtml(List.of(seat(101L, 4), seat(102L, 7)));

        assertThat(html)
                .contains("<td>Asha Patel</td><td>4</td>")
                .contains("<td>Ravi Kumar</td><td>7</td>")
                .doesNotContain("Passenger #101");
    }

    @Test
    void buildPassengerSeatsHtmlFallsBackWhenPassengerDetailIsUnavailable() {
        when(userApi.fetchMasterListUsers(List.of(101L))).thenReturn(List.of());

        String html = seatLockService.buildPassengerSeatsHtml(List.of(seat(101L, 4)));

        assertThat(html).contains("<td>Passenger #101</td><td>4</td>");
    }

    private static BookingSeats seat(Long passengerId, int seatNumber) {
        return BookingSeats.builder().passengerId(passengerId).seatNumber(seatNumber).build();
    }
}
