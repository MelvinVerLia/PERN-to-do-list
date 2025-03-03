import AuthFinder from "../../API/AuthFinder";
import { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTask } from "@/Context/TaskContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4042"];

const TaskPieChart = () => {
  const { chart } = useTask();

  const fixedChart = chart?.map((entry) => ({
    ...entry,
    task_count: Number(entry.task_count), 
  }));

  useEffect(() => {
    console.log("Chart Data Structure:", chart);

    console.log(chart);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Task Categories</h2>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={fixedChart}
              cx="50%"
              cy="50%"
              innerRadius={10} // Added this to make a donut shape
              outerRadius={80} // Reduced size
              fill="#8884d8"
              dataKey="task_count"
              nameKey="category_name"
            >
              
              {chart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} Tasks`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskPieChart;
