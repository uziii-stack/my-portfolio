/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#1cd8d2",
        secondary: "#00bf8f",
        third: "#302b63",
      },
      backgroundImage: {
        gradientCustom: "linear-gradient(-45deg, #302b63 , #00bf8f, #1cd8d2)",
      },
    },
  },
  plugins: [],
};
