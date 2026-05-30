import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#081A2F',
        surface: '#0C2237',
        'surface-elevated': '#10293F',
        primary: {
          DEFAULT: '#D9B36C',
          soft: '#E6C988',
          deep: '#B8924E',
        },
        text: '#FFFFFF',
        secondary: '#BFC8D6',
        success: '#3BA55D',
        danger: '#E5484D',
        border: 'rgba(217, 179, 108, 0.16)',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '1240px',
      },
      boxShadow: {
        glow: '0 0 80px rgba(217, 179, 108, 0.25)',
        'glow-soft': '0 0 40px rgba(217, 179, 108, 0.15)',
        card: '0 24px 60px rgba(3, 12, 24, 0.45)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(217,179,108,0.16), transparent 60%)',
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(217,179,108,0.6), transparent)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'capsule-3d': {
          from: { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(360deg)' },
        },
        'orbit-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'spin-slow': 'spin-slow 32s linear infinite',
        'capsule-3d': 'capsule-3d 16s linear infinite',
        'orbit-spin': 'orbit-spin 52s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
