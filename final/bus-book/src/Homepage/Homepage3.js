import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">BlueBus</span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed mb-5">
              India's trusted bus booking platform. Connecting cities with comfort, safety, and reliability.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={s.label}
                  className="w-8 h-8 bg-surface-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-150"
                >
                  <svg className="w-4 h-4 text-surface-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/book-bus', label: 'Book a Bus' },
                { to: '/check-status', label: 'Check Status' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/master-list', label: 'Passengers' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Locations</h4>
            <ul className="space-y-2.5">
              {['India', 'Japan', 'Russia', 'USA', 'France'].map((loc) => (
                <li key={loc} className="text-sm text-surface-400 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact Info</h4>
            <ul className="space-y-3">
              {[
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+123-456-7890' },
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'biswajit2329@gmail.com' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Hyderabad, India - 500016' },
              ].map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                  </svg>
                  <span className="text-sm text-surface-400">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} BlueBus. All rights reserved.
          </p>
          <p className="text-sm text-surface-500">
            Built with ❤️ by <span className="text-surface-300 font-medium">Biswajit Ghosh</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
