package com.booking.bus.repository;

import com.booking.bus.entities.Bus;
import com.booking.bus.enums.BusStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    boolean existsByBusNameAndCreatedByAndIsActiveTrue(String busName, Long createdBy);

    List<Bus> findByCreatedByAndIsActiveTrue(Long createdBy);

    List<Bus> findByIsActiveTrue();

    Page<Bus> findByStatusInAndIsActiveTrue(List<BusStatus> statuses, Pageable pageable);

    Page<Bus> findByCreatedByAndStatusInAndIsActiveTrue(Long createdBy, List<BusStatus> statuses, Pageable pageable);

    Optional<Bus> findByIdAndStatusAndIsActiveTrue(Long id, BusStatus status);

    @Query("SELECT b FROM Bus b LEFT JOIN FETCH b.stations WHERE b.id = :id")
    Optional<Bus> findByIdWithStations(@Param("id") Long id);

    @Query("""
                SELECT DISTINCT b
                FROM Bus b
                JOIN b.stations src
                JOIN b.stations dest
                WHERE b.status = :status
                  AND b.isActive = true
                  AND LOWER(src.stationName) = LOWER(:source)
                  AND LOWER(dest.stationName) = LOWER(:destination)
                  AND src.stationOrder < dest.stationOrder
            """)
    List<Bus> searchBus(@Param("source") String source, @Param("destination") String destination, @Param("status") BusStatus status);

    @Query("""
                SELECT b FROM Bus b
                WHERE b.isActive = true AND b.status = :status
                ORDER BY b.averageRating DESC, b.totalReviewsCount DESC
                LIMIT 10
            """)
    List<Bus> getTopRated(@Param("status") BusStatus status);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = """
            UPDATE bus
            SET total_rating_sum = total_rating_sum + :batchSum,
                total_reviews_count = total_reviews_count + :batchCount,
                average_rating = ROUND((total_rating_sum + :batchSum) / (total_reviews_count + :batchCount), 2)
            WHERE id = :busId
            """, nativeQuery = true)
    void updateIncrementalRating(@Param("busId") Long busId, @Param("batchSum") Long batchSum, @Param("batchCount") Long batchCount);
}
