import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FAF3F5",
          100: "#F4DDE2",
          200: "#E9C3CB",
          300: "#D9B7AE",
          400: "#C9919E",
          500: "#AF6B7A",
        },
        ivory: {
          50: "#FCFAF7",
          100: "#FFF9F3",
          200: "#F5ECE1",
          300: "#EADCCB",
          400: "#D6BF9F",
        },
        gold: {
          50: "#FAF6ED",
          100: "#F3E8CE",
          200: "#E4CF9F",
          300: "#D5B876",
          400: "#C5A46D", // Champagne Gold Accent
          500: "#AB894E",
          600: "#8C6E37",
          700: "#6B5328",
        },
        rose: {
          beige: "#D9B7AE",
          mist: "#E8D3CE",
        },
        chocolate: {
          DEFAULT: "#382B2B", // Deep Chocolate Brown
          light: "#4E3C3C",
          dark: "#261D1D",
          deep: "#1C1414",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(56, 43, 43, 0.08)",
        "luxury-lg": "0 25px 60px -15px rgba(56, 43, 43, 0.15)",
        gold: "0 8px 30px -4px rgba(197, 164, 109, 0.25)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
