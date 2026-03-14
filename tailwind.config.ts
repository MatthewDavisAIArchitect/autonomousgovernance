import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "near-black": "#0F0F0F",
        "off-white": "#F5F4F0",
        "mid-grey": "#6B6B6B",
        "rule-grey": "#CCCCCC",
        accent: "#2C4A7C",
        "id-bg": "#E8EDF5",
        // SEALED — use only in ClassificationLabel component
        "label-conserving": "#4A7C59",
        "label-non-conserving": "#B5651D",
        "label-refusal": "#8B2020",
      },
      fontFamily: {
        serif: ["Source Serif 4", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
