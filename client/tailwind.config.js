/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        companyRed: "#CE172D",
      },
      height: {
        600: "37.5rem",
      },
      width: {
        300: "18.75rem",
      },
    },
  },
  plugins: [],
};
