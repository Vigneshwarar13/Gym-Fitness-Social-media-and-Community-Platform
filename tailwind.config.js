/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Emerald 500
        secondary: "#F97316", // Orange 500
        dark: {
          900: "#111827", // Gray 900
          800: "#1F2937", // Gray 800
          700: "#374151", // Gray 700
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
