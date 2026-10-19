package com.booking.bus.repository;

import com.booking.bus.entities.Station;
import com.booking.bus.enums.BusStatus;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    @Cacheable(value = "stations", key = "'distinctNames'")
    @Query("SELECT DISTINCT s.stationName FROM Station s WHERE s.status = :status AND" +
            " s.bus.isActive = true ORDER BY s.stationName ASC")
    List<String> findDistinctStationNames(@Param("status") BusStatus status);

    @Query("""
            SELECT DISTINCT s.stationName
            FROM Station s
            WHERE LOWER(s.stationName) LIKE LOWER(CONCAT('%', :src, '%'))
            """)
    List<String> searchStationNamesBySrc(@Param("src") String src);

    @Query("""
            SELECT DISTINCT s.stationName
            FROM Station s
            WHERE LOWER(s.stationName) LIKE LOWER(CONCAT('%', :dist, '%'))
            """)
    List<String> searchStationNamesByDist(@Param("dist") String dist);
}
