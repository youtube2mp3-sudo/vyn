import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // Light mode
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f5f5f5",
          muted: "#ebebeb",
          strong: "#e0e0e0",
        },
        // Text
        ink: {
          DEFAULT: "#0a0a0a",
          secondary: "#525252",
          tertiary: "#a3a3a3",
          quaternary: "#d4d4d4",
        },
        // Presence
        online: "#22c55e",
        dnd: "#ef4444",
        idle: "#f59e0b",
        offline: "#737373",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.06)",
        "card-dark":
          "0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)",
        "card-dark-hover":
          "0 4px 12px 0 rgba(0,0,0,0.5), 0 2px 6px -2px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "fade-up": "fadeUp 0.5s ease-out both",
        "skeleton-pulse": "skeletonPulse 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
