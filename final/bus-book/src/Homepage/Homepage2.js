import React from 'react';
import { Link } from 'react-router-dom';
import busImg from '../images/bus-4.jpg';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'On Time',
    desc: 'Punctual departures and arrivals you can count on.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Safe Travel',
    desc: 'Verified drivers and well-maintained vehicles.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Easy Payments',
    desc: 'Secure, hassle-free booking with instant confirmation.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Support',
    desc: 'Round-the-clock customer service whenever you need it.',
    color: 'bg-orange-100 text-orange-600',
  },
];

const busTypes = [
  { name: 'Luxury Coach', desc: 'Premium reclining seats, Wi-Fi, charging ports, and entertainment systems for a first-class journey.', tag: 'Premium' },
  { name: 'Eco-Friendly Shuttle', desc: 'Clean energy-powered vehicles that minimize environmental impact without compromising comfort.', tag: 'Green' },
  { name: 'City Tour Bus', desc: 'Double-decker panoramic buses with hop-on-hop-off flexibility and informative commentary.', tag: 'Tour' },
  { name: 'Executive Mini Bus', desc: 'Leather seating, climate control, and professional drivers for corporate events and group outings.', tag: 'Business' },
  { name: 'Charter Bus', desc: 'Spacious interiors with onboard restrooms for large group travel — reunions, retreats, and excursions.', tag: 'Group' },
  { name: 'Airport Shuttle', desc: 'Regular departures to and from major airports ensuring timely arrivals and departures.', tag: 'Airport' },
];

const Homepage2 = () => {
  return (
    <>
      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Why BlueBus</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mt-2 mb-4">Travel with Confidence</h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              We're committed to making every journey comfortable, safe, and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((f, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.color} mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* About section with image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={busImg}
                alt="BlueBus fleet"
                className="w-full h-72 lg:h-96 object-cover rounded-2xl shadow-card-hover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white rounded-xl px-5 py-3 shadow-lg">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-primary-200">Routes Covered</p>
              </div>
            </div>
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold text-surface-900 mt-2 mb-4">Best Bus Service in the Country</h2>
              <p className="text-surface-600 mb-6 leading-relaxed">
                BlueBus connects cities and towns with a modern fleet of well-maintained buses. From luxury coaches to eco-friendly shuttles, we have the right vehicle for every journey.
              </p>
              <div className="space-y-3 mb-8">
                {['Verified and experienced drivers', 'Real-time seat availability', 'Instant booking confirmation', 'Easy cancellation policy'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-surface-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/book-bus" className="btn-primary btn-lg">
                Book Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Types */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Our Fleet</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mt-2 mb-4">Bus Types for Every Need</h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              Choose from our diverse fleet designed to match every travel requirement and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {busTypes.map((bus, i) => (
              <div key={i} className="card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
                    </svg>
                  </div>
                  <span className="badge badge-blue">{bus.tag}</span>
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{bus.name}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{bus.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage2;
