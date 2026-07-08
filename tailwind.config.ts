import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0A1A',
        surface: '#1A1530',
        'surface-2': '#231E40',
        'surface-3': '#2D2850',
        primary: {
          DEFAULT: '#FDCA00',
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF176',
          300: '#FFE740',
          400: '#FFD800',
          500: '#FDCA00',
          600: '#D4A800',
          700: '#AB8700',
          800: '#826600',
          900: '#594500',
        },
        secondary: {
          DEFAULT: '#0D3DC8',
          50: '#EEF2FE',
          100: '#DBE4FD',
          200: '#BFCFFB',
          300: '#93ADF7',
          400: '#5577EE',
          500: '#0D3DC8',
          600: '#0B35AD',
          700: '#092C92',
          800: '#072377',
          900: '#051A5C',
        },
        gold: {
          DEFAULT: '#FDCA00',
          light: '#FFE566',
          dark: '#C9A200',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0B8',
          muted: '#6B6B80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0D0A1A 0%, #1A0A2E 50%, #0D0A1A 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(13,10,26,0.9) 100%)',
        'yellow-gradient': 'linear-gradient(135deg, #FDCA00 0%, #D4A800 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0D3DC8 0%, #092C92 100%)',
        'purple-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
        'dark-gradient': 'linear-gradient(180deg, transparent 0%, #0D0A1A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(253,202,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(253,202,0,0.6), 0 0 80px rgba(253,202,0,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(253,202,0,0.4)',
        'glow-yellow': '0 0 20px rgba(253,202,0,0.4)',
        'glow-blue': '0 0 20px rgba(13,61,200,0.4)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.4)',
        'glow-gold': '0 0 20px rgba(253,202,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'inner-glow': 'inset 0 0 30px rgba(253,202,0,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
}

export default config
