export const getNivoTheme = (mode) => ({
  axis: {
    ticks: {
      text: {
        fill: mode === "dark" ? "#ffffff" : "#333333",
      },
    },
    legend: {
      text: {
        fill: mode === "dark" ? "#ffffff" : "#333333",
      },
    },
  },
  legends: {
    text: {
      fill: mode === "dark" ? "#ffffff" : "#333333",
    },
  },
  tooltip: {
    container: {
      background: mode === "dark" ? "#1f2937" : "#ffffff",
      color: mode === "dark" ? "#ffffff" : "#000000",
    },
  },
  grid: {
    line: {
      stroke: mode === "dark" ? "#555" : "#ddd",
      strokeWidth: 0.5,
      strokeDasharray: "4 4", // 🔹 Dashed lines
    },
  },
});
