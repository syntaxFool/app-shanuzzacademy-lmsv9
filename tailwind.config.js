/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#64748b',
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-in forwards',
      },
      keyframes: {
        slideDown: {
          from: {
            transform: 'translate(-50%, -120%)',
            opacity: '0'
          },
          to: {
            transform: 'translate(-50%, 0)',
            opacity: '1'
          }
        },
        slideUp: {
          from: {
            transform: 'translate(-50%, 0)',
            opacity: '1'
          },
          to: {
            transform: 'translate(-50%, -120%)',
            opacity: '0'
          }
        }
      }
    },
  },
  plugins: [],
}