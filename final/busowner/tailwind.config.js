/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  safelist: [
    // Dynamic color classes used in stats cards
    'text-indigo-600', 'bg-indigo-50',
    'text-emerald-600', 'bg-emerald-50',
    'text-violet-600', 'bg-violet-50',
    'text-amber-600', 'bg-amber-50',
    // Dynamic color classes used in EditBus status buttons
    'bg-amber-500', 'bg-emerald-500', 'bg-red-500',
    'border-amber-500', 'border-emerald-500', 'border-red-500',
    'text-amber-500', 'text-emerald-500', 'text-red-500',
    // Hover shadow
    'hover:shadow-card-hover',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand = indigo
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          strong: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-hover': '0 4px 12px -2px rgb(0 0 0 / 0.12), 0 2px 6px -2px rgb(0 0 0 / 0.08)',
        modal: '0 20px 40px -8px rgb(0 0 0 / 0.18)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
