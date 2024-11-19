const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    './**/*.html',
    './*.html',
    './**/*.js',
    './*.js',
    './**/*.vue',
    './*.vue',
    './node_modules/@ionic/core/**/*.css',
    './node_modules/@ionic/vue/**/*.js',
    './node_modules/@ionic/core/**/*.js',
  ],
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      minHeight: {
        "screen-75": "75vh",
      },
      fontSize: {
        "55": "55rem",
      },
      opacity: {
        "80": ".8",
      },
      zIndex: {
        "2": 2,
        "3": 3,
      },
      inset: {
        "-100": "-100%",
        "-225-px": "-225px",
        "25-px": "25px",
      },
      height: {
        "95-px": "95px",
        "600-px": "600px",
      },
      maxHeight: {
        "860-px": "860px",
      },
      maxWidth: {
        "580-px": "580px",
      },
      minWidth: {
        "140-px": "140px",
        "48": "12rem",
      },
      backgroundSize: {
        full: "100%",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addComponents, theme }) {
      const screens = theme("screens", {});
      addComponents([
        {
          ".container": { width: "100%" },
        },
        {
          [`@media (min-width: ${screens.sm})`]: {
            ".container": { "max-width": "640px" },
          },
        },
        {
          [`@media (min-width: ${screens.md})`]: {
            ".container": { "max-width": "768px" },
          },
        },
        {
          [`@media (min-width: ${screens.lg})`]: {
            ".container": { "max-width": "1024px" },
          },
        },
        {
          [`@media (min-width: ${screens.xl})`]: {
            ".container": { "max-width": "1280px" },
          },
        },
      ]);
    }),
  ],
};
