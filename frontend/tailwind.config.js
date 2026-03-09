/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0f0f12",
        primary: {
          DEFAULT: "#7c3aed", // violet-600
          light: "#a78bfa", // violet-400
          dark: "#5b21b6", // violet-800
        },
        secondary: {
          DEFAULT: "#a855f7", // purple-500
          light: "#d8b4fe", // purple-300
          dark: "#7e22ce", // purple-700
        },
        accent: {
          pink: "#ec4899",
          blue: "#3b82f6",
        }
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #000000 0%, #050505 100%)',
        'gradient-premium': 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
      },
      boxShadow: {
        'purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'purple-lg': '0 0 30px rgba(124, 58, 237, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
