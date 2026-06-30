package com.booking.bus.repository;

import com.booking.bus.entities.Station;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    @Cacheable(value = "stations", key = "'distinctNames'")
    @Query("SELECT DISTINCT s.stationName FROM Station s")
    List<String> findDistinctStationNames();
}
