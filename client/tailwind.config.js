export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#F4F4F4",
        primary: "#0642DA",
        accent: "#0642DA",
        accentYellow: "#E0C301",
        accentSoft: "#e6f0ff",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(6, 66, 218, 0.14)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
