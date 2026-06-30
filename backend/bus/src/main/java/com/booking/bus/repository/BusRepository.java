package com.booking.bus.repository;

import com.booking.bus.entities.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    boolean existsByBusNameAndCreatedByAndIsActiveTrue(String busName, Long createdBy);

    List<Bus> findByCreatedByAndIsActiveTrue(Long createdBy);

    @Query("""
        SELECT DISTINCT b
        FROM Bus b
        JOIN b.stations src
        JOIN b.stations dest
        WHERE LOWER(src.stationName) = LOWER(:source)
          AND LOWER(dest.stationName) = LOWER(:destination)
          AND src.stationOrder < dest.stationOrder
          AND b.isActive = true
    """)
    List<Bus> searchBus(
            @Param("source") String source,
            @Param("destination") String destination
    );
}
