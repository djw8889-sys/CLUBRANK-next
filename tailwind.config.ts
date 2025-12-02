/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GDLY 공식 컬러셋
        background: "#0A2342", // Deep Navy
        surface: "#1A1F25", // Dark Gray
        primary: "#9FE870", // Neon Lime
        textPrimary: "#FFFFFF",
        textSecondary: "#D1D5DB",
        muted: "#9CA3AF",

        success: "#4ADE80",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#60A5FA",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
