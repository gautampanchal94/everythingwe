module.exports = {
  content: ["./*.html", "**/*.ejs", "./*.js"],
  theme: {
    extend: {
      colors: {
        cordovan: "#8b4c56",
        "pale-pink": "#ecd4d4",
      },
    },
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
      serif: ["IBM Plex Serif", "serif"],
      mono: ["IBM Plex Mono", "monospace"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
