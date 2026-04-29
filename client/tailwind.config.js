export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f7f2ea",
        accent: "#2563eb",
        accentSoft: "#dbeafe",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(37, 99, 235, 0.18)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
