/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        velune: {
          bg:        '#0b0b0f',
          surface:   '#111116',
          card:      '#15151a',
          border:    '#242428',
          text:      '#f0ece3',
          muted:     '#8e8a83',
          accent:    '#c8a96e',
          'accent-hover': '#d8bc88',
          // Light/ivory theme
          'light-bg':      '#f7f3ec',
          'light-surface': '#ede7d6',
          'light-card':    '#fefcf8',
          'light-border':  '#dbd3be',
          'light-text':    '#1a1206',
          'light-muted':   '#6b6355',
          'light-accent':  '#9d7d45',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(30px, 4.8vw, 66px)',
        'hero-sm': 'clamp(28px, 4vw, 54px)',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
