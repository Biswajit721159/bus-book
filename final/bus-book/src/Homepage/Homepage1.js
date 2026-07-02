import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import data from '../constant/carousel';

const Homepage1 = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = (i) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(i);
      setIsTransitioning(false);
    }, 200);
  };

  const next = () => goTo((index + 1) % data.length);
  const prev = () => goTo((index - 1 + data.length) % data.length);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <section className="relative h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden bg-surface-900">
      {/* Images */}
      {data.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={src}
            alt={`Bus ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            India's Trusted Bus Booking
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Travel Smarter,<br />
            <span className="text-primary-300">Book Faster</span>
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-8 drop-shadow">
            Comfortable, affordable bus journeys across the country. Book your seat in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book-bus"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
              </svg>
              Book a Bus Now
            </Link>
            <Link
              to="/check-status"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 transition-all duration-150"
            >
              Check Ticket Status
            </Link>
            <a
              href={process.env.REACT_APP_BUS_OWNER_URL || "http://localhost:3001"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Bus Owner Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Homepage1;
