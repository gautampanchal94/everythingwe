module.exports = {
  content: ["./*.html", "**/*.ejs", "./*.js"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
      serif: ["IBM Plex Serif", "serif"],
      mono: ["IBM Plex Mono", "monospace"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
