/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            DEFAULT: '#F97316',
            hover: '#EA580C',
            light: '#FFEDD5',
            dark: '#C2410C',
          },
          cosmetics: {
            primary: '#0D9488',
            hover: '#0F766E',
            light: '#CCFBF1',
            dark: '#115E59',
            emerald: '#059669',
            badge: '#10B981',
          },
          rehab: {
            primary: '#65A30D',
            hover: '#4D7C0F',
            light: '#ECFCCB',
            dark: '#3F6212',
            olive: '#84CC16',
          },
          huiles: {
            primary: '#15803D',
            hover: '#166534',
            light: '#DCFCE7',
            dark: '#14532D',
            forest: '#22C55E',
          },
          formations: {
            primary: '#0284C7',
            hover: '#0369A1',
            light: '#E0F2FE',
            dark: '#075985',
            corporate: '#0EA5E9',
          },
          seo: {
            primary: '#6366F1',
            hover: '#4F46E5',
            light: '#EEF2FF',
            dark: '#3730A3',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 10s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(15px) rotate(-3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
