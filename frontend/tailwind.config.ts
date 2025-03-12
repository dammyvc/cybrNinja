import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1200px",
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        primary: '#d02115',
        secondary: '#15D17F',
        accent: '#1566D1',
        fourth: '#15D150',
        fifth: '#C4D115',
        background: '#F9FCFF',
        gray_bg:'#030712',
        light: '#f5f5f5',
        dark: '#1b1b1b',
        white: '#ffffff',
        success: '#00FF88',
        error: '#FF2E63',
        warning:'#f3bb1b'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          lg: "2rem",
        },
      },
      gap: {
        18: "4.5rem",
      },
      inset: {
        18: "4.5rem",
      },
      height: {
        18: "4.5rem",
      },
      padding: {
        18: "4.5rem",
      },
      rotate: {
        135: "135deg",
        225: "225deg",
        270: "270deg",
        315: "315deg",
      },
      animation: {
        move: "move 5s linear infinite",
      },
      keyframes: {
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
