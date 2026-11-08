import { ResponsiveLine } from "@nivo/line";
import { useThemeContext } from "../../../context/ThemeContext";
import { getNivoTheme } from "./getNivoTheme";

const ReportLineChart = ({ reports, loading }) => {
  const { theme } = useThemeContext();
  const nivoTheme = getNivoTheme(theme);

  const formattedData = [
    {
      id: "Reports",
      color: "#3399FF",
      data:
        reports?.data?.map((item) => ({
          x: item.key,
          y: item.value,
        })) || [],
    },
  ];

  const yValues = reports?.data?.map((item) => item.value) || [];

  const maxY = Math.max(...yValues, 0);

  let niceMaxY;
  if (maxY <= 100) {
    niceMaxY = Math.ceil(maxY / 10) * 10 || 10;
  } else if (maxY <= 1000) {
    niceMaxY = Math.ceil(maxY / 100) * 100;
  } else {
    niceMaxY = Math.ceil(maxY / 1000) * 1000;
  }

  const tickStep = niceMaxY / 5;
  const tickValues = Array.from({ length: 6 }, (_, i) => i * tickStep);

  const formatTick = (v) => {
    if (niceMaxY > 1000) return `${v / 1000}k`;
    return v;
  };

  return (
    <div style={{ height: "290px" }} className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-dark dark:text-gray-light text-lg font-medium">
            Loading reports graph...
          </span>
        </div>
      )}
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: niceMaxY,
          stacked: false,
          reverse: false,
        }}
        curve="linear"
        axisLeft={{
          tickValues,
          legend: "Reports",
          legendOffset: -50,
          legendPosition: "middle",
          format: formatTick,
        }}
        axisBottom={{
          legend: "Time Period",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        colors={{ datum: "color" }}
        lineWidth={3}
        pointSize={0}
        useMesh={true}
        enableGridX={false}
        enableGridY={true}
        enableArea={true}
        areaOpacity={0.1}
        theme={nivoTheme}
      />
    </div>
  );
};

export default ReportLineChart;
