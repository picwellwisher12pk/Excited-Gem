import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "var(--text-dark)", 
        bg: "var(--bg-default)", 
        light: "var(--bg-light)", 
        secondary: "var(--half-white)", 
        card: "var(--bg-card)", 
        border: "var(--border)", 
        alert: "var(--alert)", 
        'alert-icon': 'var(--alert-icon)',
        select: "var(--select)", 
        'card-border': "var(--card-border)", 
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
