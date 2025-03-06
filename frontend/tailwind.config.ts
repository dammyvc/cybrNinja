import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        int: ['var(--font-int)'],
      },
      colors: {
        primary: '#d02115',
        secondary: '#15D17F',
        accent: '#1566D1',
        background: '#F9FCFF',
        light: '#f5f5f5',
        dark: '#1b1b1b',
        white: '#ffffff',
        success: '#00FF88',
        error: '#FF2E63',
        warning:'#f3bb1b'
      },
    },
    screens: {
      sm: { max: '749px' },
      md: { max: '999px' },
      // 'lg': {'min': '1024px'},
      // other breakpoints...
    },
  },
  plugins: [],
} satisfies Config;
