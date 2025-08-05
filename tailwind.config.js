/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ECFAE5",
          100: "#DDF6D2",
          200: "#CAE8BD",
          300: "#B0DB9C",
          400: "#9ACF86",
          500: "#85C36F",
          600: "#6CB153",
          700: "#588F42",
          800: "#456C33",
          900: "#324D24",
        },
        background: {
          light: "#FFFFFF",
          dark: "#ECFAE5",
        },
        accent: {
          DEFAULT: "#85C36F",
          light: "#CAE8BD",
          dark: "#6CB153",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 15px rgba(0, 0, 0, 0.05)",
        card: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
