/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2A0944',
          DEFAULT: '#3B0764',
          light: '#580F96',
          lighter: '#8E05C2'
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          dark: '#E0E0E0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'custom': '0 4px 14px 0 rgba(42, 9, 68, 0.1)'
      }
    },
  },
  plugins: [],
}