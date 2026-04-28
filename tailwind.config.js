/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        linen: "#F3EFE6",
        charcoal: "#2E2A25",
        persimmon: "#A3543F",
        clay: "#4A4037",
        oat: "#D8CDBB",
        ash: "#81776B",
        parchment: "#FBF8F1"
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Noto Serif SC", "Georgia", "serif"],
        sans: ["Inter", "Noto Sans SC", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 48px rgba(46, 42, 37, 0.08)"
      }
    }
  },
  plugins: []
};
