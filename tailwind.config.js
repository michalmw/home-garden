/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e", // Green-500 - Main green
        secondary: "#0ea5e9", // Sky-500 - Vibrant blue
        accent: "#4ade80", // Green-400 - Lighter green
        background: "#f0fdf5", // Lightest green background
        "bg-blue": "#ecfeff", // Lightest cyan background
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        button:
          "0 4px 6px -1px rgba(34, 197, 94, 0.2), 0 2px 4px -1px rgba(34, 197, 94, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
