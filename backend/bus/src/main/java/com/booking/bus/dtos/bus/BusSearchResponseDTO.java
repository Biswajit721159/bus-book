package com.booking.bus.dtos.bus;

import com.booking.bus.entities.Bus;
import com.booking.bus.entities.Station;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Data
@NoArgsConstructor
public class BusSearchResponseDTO {
    private String busId;
    private String busName;
    private String sourceStationName;
    private String destinationStationName;
    private String arrivalTime;
    private String departureTime;
    private String totalTime;
    private int totalDistance;

    public static BusSearchResponseDTO from(Bus bus, String source, String destination) {
        BusSearchResponseDTO dto = new BusSearchResponseDTO();
        dto.busId = String.valueOf(bus.getId());
        dto.busName = bus.getBusName();

        List<Station> sortedStations = bus.getStations().stream()
                .sorted(Comparator.comparingInt(Station::getStationOrder))
                .toList();

        Station start = null;
        Station end = null;

        for (Station s : sortedStations) {
            if (s.getStationName().equalsIgnoreCase(source)) {
                start = s;
            } else if (s.getStationName().equalsIgnoreCase(destination)) {
                end = s;
            }
        }

        // Fallbacks in case station names aren't matched exactly
        if (start == null && !sortedStations.isEmpty()) {
            start = sortedStations.get(0);
        }
        if (end == null && !sortedStations.isEmpty()) {
            end = sortedStations.get(sortedStations.size() - 1);
        }

        if (start != null && end != null) {
            dto.sourceStationName = start.getStationName();
            dto.destinationStationName = end.getStationName();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            dto.arrivalTime = start.getArrivalTime().format(formatter);
            dto.departureTime = end.getArrivalTime().format(formatter);

            // Calculate total time duration
            LocalTime startTime = start.getArrivalTime();
            LocalTime endTime = end.getArrivalTime();
            Duration duration = Duration.between(startTime, endTime);
            if (duration.isNegative()) {
                duration = duration.plusDays(1);
            }
            long hours = duration.toHours();
            long minutes = duration.toMinutes() % 60;
            dto.totalTime = hours + "h:" + minutes + "m";

            // Calculate total distance between start_station and end_station
            int distance = 0;
            int startOrder = start.getStationOrder();
            int endOrder = end.getStationOrder();
            for (Station s : sortedStations) {
                if (s.getStationOrder() > startOrder && s.getStationOrder() <= endOrder) {
                    distance += s.getDistanceFromLastStation();
                }
            }
            dto.totalDistance = distance;
        } else {
            dto.sourceStationName = source;
            dto.destinationStationName = destination;
            dto.arrivalTime = "00:00";
            dto.departureTime = "00:00";
            dto.totalTime = "0h:0m";
            dto.totalDistance = 0;
        }
        return dto;
    }
}
