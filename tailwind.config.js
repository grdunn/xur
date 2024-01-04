/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    colors: {
      "xur-dark-bg": "#161616",
      "xur-dark-bg-secondary": "#1e1e1e",
      "xur-dark-border": "#545454",
    },
    extend: {
      screens: {
        xl: "1100px",
        "2xl": "1100px",
      },
    },
  },
  plugins: [],
};
