/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tracker: {
          bg: {
            light: '#f8fafc',
            dark: '#0a0f1d',
          },
          card: {
            light: 'rgba(255, 255, 255, 0.85)',
            dark: 'rgba(17, 24, 39, 0.75)',
          },
          border: {
            light: 'rgba(226, 232, 240, 0.8)',
            dark: 'rgba(255, 255, 255, 0.08)',
          }
        },
        habit: {
          dsa: '#8b5cf6',       // purple
          workout: '#f97316',   // orange
          eating: '#10b981',    // green
          aiml: '#3b82f6',      // blue
          water: '#06b6d4',     // cyan
          sleep: '#6366f1',     // indigo
          photo: '#ec4899',     // pink
          journal: '#eab308',   // yellow
          priority: '#14b8a6',  // teal
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-glow': '0 0 25px rgba(99, 102, 241, 0.35)',
        'flame-glow': '0 0 35px rgba(249, 115, 22, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'flame-pulse': {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))' },
          '50%': { transform: 'scale(1.08) rotate(1deg)', filter: 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.85))' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'flame': 'flame-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
