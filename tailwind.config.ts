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
        primary: {
          DEFAULT: "#1D9E75",
          dark: "#147a59",
          light: "#e6f5ef",
          muted: "#c5e8d9",
        },
        app: {
          bg: "#eef1f0",
          surface: "#ffffff",
          ink: "#0f172a",
          muted: "#64748b",
        },
        featured: {
          ring: "#1D9E75",
        },
      },
      fontSize: {
        "display-sm": ["1.375rem", { lineHeight: "1.35", fontWeight: "700" }],
        display: ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

export default config;
