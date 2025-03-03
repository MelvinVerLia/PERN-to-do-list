import { useState, useEffect } from "react";
import AuthFinder from "../../API/AuthFinder";
import { RadialBarChart, RadialBar, Tooltip } from "recharts";

interface TaskEntry {
  productivity: string;
}

export default function ProductivityCircle() {
  const [productivity, setProductivity] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await AuthFinder("task/count");
      console.log("🚀 ~ fetchCount ~ response:", response.data);

      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      // Aggregate productivity for all days (get the avg score)
      const totalProductivity = response.data.reduce(
        (sum: number, entry: TaskEntry) =>
          sum + (parseFloat(entry.productivity) || 0), // Avoid NaN
        0
      );
      const averageProductivity = response.data.length
        ? totalProductivity / response.data.length
        : 0;

      // Ensure productivity is between 0-100
      setProductivity(Math.min(100, Math.max(0, averageProductivity)));
    } catch (error) {
      console.error("Error fetching task count:", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  // Determine color based on productivity level
  const getProductivityColor = (value: number) => {
    if (value < 40) return "#ff0000"; // Red for low productivity
    if (value < 70) return "#ff5917"; // Orange for medium productivity
    return "#00eb04"; // Green for high productivity
  };

  const productivityColor = getProductivityColor(productivity);

  // Data format for Radial Bar Chart
  const data = [{ name: "Productivity", value: productivity, fill: productivityColor }];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Weekly Productivity</h2>
      <div className="relative">
        <RadialBarChart
          width={250}
          height={250}
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={15}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar 
            background 
            dataKey="value" 
            cornerRadius={30}
          />

        </RadialBarChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-bold" style={{ color: productivityColor }}>
            {Math.round(productivity)}%
          </p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span> Low (&lt;40%)
        <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mx-1 ml-3"></span> Medium (40-70%)
        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mx-1 ml-3"></span> High (&gt;70%)
      </div>
    </div>
  );
}