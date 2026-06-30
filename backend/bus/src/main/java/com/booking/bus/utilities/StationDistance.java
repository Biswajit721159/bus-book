package com.booking.bus.utilities;

import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;

import java.util.List;

public class StationDistance {
    public static int calculateDistance(Bookings bookings) {
        int distance = 0;
        Bus bus = bookings.getBus();
        List<Station> stations = bus.getStations();
        int sourceStationOrder = bookings.getSourceStationId().getStationOrder();
        int distinctionStationOrder = bookings.getDestinationStationId().getStationOrder();

        for (Station station : stations) {
            int stationOrder = station.getStationOrder();
            if (sourceStationOrder < stationOrder && stationOrder <= distinctionStationOrder) {
                distance += station.getDistanceFromLastStation();
            }
        }
        return distance;
    }
}
