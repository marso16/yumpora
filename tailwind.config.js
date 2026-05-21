/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#FFB800",
        dark: "#2C1810",
        cream: "#FFF9F0",
      },
      fontFamily: {
        display: ["Boogaloo", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
