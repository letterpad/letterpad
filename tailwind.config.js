/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#0a192f",
        "dark-gray": "#1c2938",
        "light-gray": "#8892b0",
        "light-blue": "#ccd6f6",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
