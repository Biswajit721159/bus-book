import React from 'react';
import { Link } from 'react-router-dom';

const WishList = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">Wishlist Coming Soon</h2>
        <p className="text-surface-500 text-sm mb-6">
          We're working on this feature. In the meantime, you can save journeys from your booking history.
        </p>
        <Link to="/my-bookings" className="btn-primary">
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default WishList;
