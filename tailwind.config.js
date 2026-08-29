/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
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
        accent: {
          purple: '#8b5cf6',
          pink:   '#ec4899',
          cyan:   '#06b6d4',
          emerald:'#10b981',
        },
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'slide-up':      'slideUp 0.6s ease forwards',
        'fade-in':       'fadeIn 0.5s ease forwards',
        'gradient-x':    'gradientX 4s ease infinite',
        'spin-slow':     'spin 8s linear infinite',
        'bounce-slow':   'bounce 3s infinite',
        'blink':         'blink 1s step-end infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(99,102,241,0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow':    '0 0 30px rgba(99,102,241,0.35)',
        'glow-sm': '0 0 15px rgba(99,102,241,0.25)',
        'inner-glow': 'inset 0 0 20px rgba(99,102,241,0.1)',
      },
    },
  },
  plugins: [],
}
