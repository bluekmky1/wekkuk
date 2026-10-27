import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        brand: ["Tenada", "Pretendard", "sans-serif"],
      },
      fontSize: {
        micro: ["11px", { lineHeight: "14px" }],
        caption: ["12px", { lineHeight: "16px" }],
        body: ["14px", { lineHeight: "20px" }],
        heading: ["16px", { lineHeight: "22px" }],
        "heading-lg": ["18px", { lineHeight: "24px" }],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        error: "var(--color-error)",
        neutral: {
          white: "var(--color-neutral-white)",
          surface: "var(--color-neutral-surface)",
          border: "var(--color-neutral-border)",
          muted: "var(--color-neutral-muted)",
          subtext: "var(--color-neutral-subtext)",
          text: "var(--color-neutral-text)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
