package com.booking.bus.dtos.Review;

public interface BatchReviewSummary {
    Long getBusId();

    Long getBatchSum();

    Long getBatchCount();

    Long getMaxIdInBatch();
}
