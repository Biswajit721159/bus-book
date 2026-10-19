import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBusById } from "../../apis/bus";
import { getReviewsByBus } from "../../apis/review";

export const useViewBus = () => {
	const [data, setData] = useState();
	const [reviews, setReviews] = useState([]);
	const [reviewTotalPages, setReviewTotalPages] = useState(1);
	const [reviewTotalElements, setReviewTotalElements] = useState(0);
	const [reviewsLoading, setReviewsLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [reviewPage, setReviewPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [load, setLoad] = useState(true);
	const { _id } = useParams();

	const isFetchingRef = useRef(false);

	const loadBus = async () => {
		try {
			setLoad(true);
			const res = await getBusById(_id);
			setData(res.data);
		} catch (error) {
			toast.warn(error?.message || "Failed to load bus details");
		} finally {
			setLoad(false);
		}
	};

	const loadInitialReviews = async () => {
		try {
			setReviewsLoading(true);
			setReviewPage(1);
			const res = await getReviewsByBus(_id, 1, 5);
			const payload = res?.data;
			if (payload?.content) {
				setReviews(payload.content);
				const totalP = payload.totalPages || 1;
				setReviewTotalPages(totalP);
				setReviewTotalElements(payload.totalElements || 0);
				setHasMore(1 < totalP);
			} else if (Array.isArray(payload)) {
				setReviews(payload);
				setReviewTotalPages(1);
				setReviewTotalElements(payload.length);
				setHasMore(false);
			} else {
				setReviews([]);
				setHasMore(false);
			}
		} catch (error) {
			setReviews([]);
			setHasMore(false);
		} finally {
			setReviewsLoading(false);
		}
	};

	const loadMoreReviews = useCallback(async () => {
		if (isFetchingRef.current || !hasMore || reviewsLoading || loadingMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		try {
			const nextPage = reviewPage + 1;
			const res = await getReviewsByBus(_id, nextPage, 5);
			const payload = res?.data;
			if (payload?.content && payload.content.length > 0) {
				setReviews((prev) => {
					const existingIds = new Set(prev.map((r) => r.id || r._id));
					const uniqueNew = payload.content.filter((r) => !existingIds.has(r.id || r._id));
					return [...prev, ...uniqueNew];
				});
				setReviewPage(nextPage);
				const totalP = payload.totalPages || reviewTotalPages;
				setReviewTotalPages(totalP);
				setReviewTotalElements(payload.totalElements || reviewTotalElements);
				setHasMore(nextPage < totalP);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			// Silently ignore pagination error
		} finally {
			setLoadingMore(false);
			isFetchingRef.current = false;
		}
	}, [_id, hasMore, reviewsLoading, loadingMore, reviewPage, reviewTotalPages, reviewTotalElements]);

	useEffect(() => {
		if (_id) {
			loadBus();
			loadInitialReviews();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_id]);

	return {
		data,
		reviews,
		reviewPage,
		reviewTotalPages,
		reviewTotalElements,
		reviewsLoading,
		loadingMore,
		hasMore,
		load,
		loadMoreReviews,
	};
};
