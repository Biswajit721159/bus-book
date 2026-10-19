package com.booking.bus.backGroundTasks;

import com.booking.bus.dtos.Review.BatchReviewSummary;
import com.booking.bus.repository.BusRepository;
import com.booking.bus.repository.CustomerReviewRepository;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class reviewService {

    private final CustomerReviewRepository reviewRepository;
    private final BusRepository busRepository;

    reviewService(CustomerReviewRepository reviewRepository, BusRepository busRepository) {
        this.reviewRepository = reviewRepository;
        this.busRepository = busRepository;
    }

    @Scheduled(cron = "${app.scheduling.review-processing.cron:0 */1 * * * *}")
    @CacheEvict(value = {"topTenBus", "busSearch"}, allEntries = true)
    @Transactional
    public void processDailyReviewsInChunks() {
        int batchSize = 1000;
        int totalProcessed = 0;
        log.info("Starting daily review processing in chunks of {}", batchSize);

        while (true) {
            List<BatchReviewSummary> summaries = reviewRepository.fetchBatchSummary(batchSize);
            if (summaries == null || summaries.isEmpty()) {
                break;
            }
            Long maxIdInBatch = 0L;
            for (BatchReviewSummary s : summaries) {
                if (s.getBusId() != null && s.getBatchSum() != null && s.getBatchCount() != null) {
                    busRepository.updateIncrementalRating(s.getBusId(), s.getBatchSum(), s.getBatchCount());
                }
                if (s.getMaxIdInBatch() != null && s.getMaxIdInBatch() > maxIdInBatch) {
                    maxIdInBatch = s.getMaxIdInBatch();
                }
            }
            if (maxIdInBatch > 0) {
                int updatedCount = reviewRepository.markBatchAsProcessed(maxIdInBatch);
                if (updatedCount <= 0) {
                    log.warn("No reviews were marked as processed for maxIdInBatch={}, breaking to prevent infinite loop", maxIdInBatch);
                    break;
                }
                totalProcessed += updatedCount;
                log.info("Processed batch up to review ID: {}, records marked: {}", maxIdInBatch, updatedCount);
            } else {
                break;
            }
        }
        log.info("Completed daily review processing. Total reviews processed: {}", totalProcessed);
    }
}
