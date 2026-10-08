import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0f17",
          900: "#0f1521",
          800: "#151d2c",
          700: "#1c2740",
          600: "#28365a",
        },
        paper: "#f4f6f9",
        accent: {
          DEFAULT: "#2f6f4f",
          light: "#3f9066",
        },
        gold: "#b98c3d",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
