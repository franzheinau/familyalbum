/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EEE1",
        paper: "#EDE1C9",
        "paper-dark": "#E2D3B4",
        ink: "#3E2E22",
        "ink-soft": "#6B5645",
        clay: "#B5654A",
        "clay-dark": "#95492F",
        mustard: "#C9A64A",
        sage: "#7C8A6A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-karla)", "sans-serif"],
        stamp: ["var(--font-special-elite)", "monospace"],
      },
      boxShadow: {
        polaroid: "0 2px 4px rgba(62,46,34,0.15), 0 10px 20px -6px rgba(62,46,34,0.25)",
        "polaroid-hover": "0 6px 10px rgba(62,46,34,0.18), 0 20px 30px -8px rgba(62,46,34,0.3)",
      },
      backgroundImage: {
        grain: "url('/grain.svg')",
      },
    },
  },
  plugins: [],
};
