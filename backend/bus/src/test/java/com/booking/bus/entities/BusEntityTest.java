package com.booking.bus.entities;

import static org.assertj.core.api.Assertions.assertThat;

import com.booking.bus.enums.BusStatus;
import java.time.LocalTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class BusEntityTest {

    @Test
    @DisplayName("Bus builder should set default values for primitive ratings and status")
    void testBusBuilderDefaults() {
        Bus bus = Bus.builder().busName("Test Express").totalSeat(40).createdBy(1L).build();

        assertThat(bus.getTotalRatingSum()).isEqualTo(0L);
        assertThat(bus.getTotalReviewsCount()).isEqualTo(0L);
        assertThat(bus.getAverageRating()).isEqualTo(0.0);
        assertThat(bus.getStatus()).isEqualTo(BusStatus.PENDING);
        assertThat(bus.isActive()).isTrue();
        assertThat(bus.getStations()).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("addStation and removeStation helper methods maintain bidirectional relation")
    void testBidirectionalHelperMethods() {
        Bus bus = Bus.builder().busName("Test Express").totalSeat(40).createdBy(1L).build();

        Station station1 = Station.builder().stationName("City A").arrivalTime(LocalTime.of(8, 0)).distanceFromLastStation(0).stationOrder(
                1).build();

        bus.addStation(station1);

        assertThat(bus.getStations()).contains(station1);
        assertThat(station1.getBus()).isEqualTo(bus);

        bus.removeStation(station1);

        assertThat(bus.getStations()).doesNotContain(station1);
        assertThat(station1.getBus()).isNull();
    }

    @Test
    @DisplayName("equals and hashCode based on ID")
    void testEqualsAndHashCode() {
        Bus bus1 = Bus.builder().id(10L).busName("Bus 1").createdBy(1L).build();
        Bus bus2 = Bus.builder().id(10L).busName("Bus 2").createdBy(2L).build();
        Bus bus3 = Bus.builder().id(20L).busName("Bus 3").createdBy(1L).build();

        assertThat(bus1).isEqualTo(bus2);
        assertThat(bus1).hasSameHashCodeAs(bus2);
        assertThat(bus1).isNotEqualTo(bus3);

        Station station1 = Station.builder().id(100L).stationName("Station 1").build();
        Station station2 = Station.builder().id(100L).stationName("Station 2").build();
        Station station3 = Station.builder().id(200L).stationName("Station 3").build();

        assertThat(station1).isEqualTo(station2);
        assertThat(station1).hasSameHashCodeAs(station2);
        assertThat(station1).isNotEqualTo(station3);
    }
}
