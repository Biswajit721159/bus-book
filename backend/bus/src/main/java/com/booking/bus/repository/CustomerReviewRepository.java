package com.booking.bus.repository;

import com.booking.bus.dtos.Review.BatchReviewSummary;
import com.booking.bus.entities.CustomerReview;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    CustomerReview findByBookingId(Long bookingId);

    CustomerReview findByBookingIdAndUser(Long bookingId, Long id);

    List<CustomerReview> findByBusIdOrderByIdDesc(Long busId);

    Page<CustomerReview> findByBusIdOrderByIdDesc(Long busId, Pageable pageable);

    @Query(value = """
            SELECT r.bus_id AS busId,
                   CAST(SUM(r.rating) AS SIGNED) AS batchSum,
                   COUNT(r.id) AS batchCount,
                   MAX(r.id) AS maxIdInBatch
            FROM (
                SELECT id, bus_id, rating
                FROM customer_review
                WHERE is_processed = false
                ORDER BY id ASC
                LIMIT :batchSize
            ) r
            GROUP BY r.bus_id
            """, nativeQuery = true)
    List<BatchReviewSummary> fetchBatchSummary(@Param("batchSize") int batchSize);

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = """
            UPDATE customer_review
            SET is_processed = true, updated_at = NOW()
            WHERE id <= :maxIdInBatch AND is_processed = false
            """, nativeQuery = true)
    int markBatchAsProcessed(@Param("maxIdInBatch") Long maxIdInBatch);
}
