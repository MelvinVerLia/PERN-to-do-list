import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/Context/ThemeContext";
import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import WeeklyTaskChart from "./WeeklyTaskChart";
import UpcomingTask from "./UpcomingTask";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";

interface Task {
  id: number;
  title: string;
  priority: number;
  deadline: string;
  completed: boolean;
  description: string;
  category_name: string;
  created_at: Date;
}

interface DashboardProps {
  tasks: Task[];
}

export default function Dashboard({ tasks }: DashboardProps) {
  const [completed, setCompleted] = useState(0);
  const { isDark } = useTheme();
  const totalTasks = tasks.length;

  useEffect(() => {
    setCompleted(tasks.filter((task) => task.completed).length);
  }, [tasks]);

  const progress = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  // Create data for the RadialBarChart
  const data = [
    {
      name: "Progress",
      value: progress,
      fill: isDark ? "#8B5CF6" : "#4F46E5",
    }
  ];

  return (
    <div className="flex gap-6 py-6 w-full px-6">
      {/* Left Side (One Card) */}
      <div className="flex flex-1 basis-1/4">
        <Card className="dark:text-white p-6 h-full w-full flex justify-center">
          <CardContent className="flex flex-col items-center">
            <div className="relative w-64 h-64">
              <RadialBarChart
                width={250}
                height={250}
                cx={125}
                cy={125}
                innerRadius={80}
                outerRadius={110}
                barSize={15}
                data={data}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30}
                  fill={isDark ? "#8B5CF6" : "#4F46E5"}
                  enableBackground={isDark ? "#374151" : "#E5E7EB"}
                />
              </RadialBarChart>
              <p
                className="absolute inset-0 flex items-center justify-center text-xl font-bold"
                style={{ color: isDark ? "white" : "#1F2937" }}
              >
                {completed} / {totalTasks} Done
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side (Two-Thirds Width) */}
      <div className="flex flex-1 basis-1/3 flex-col gap-6">
        <Card className="dark:text-white p-6 flex-1 flex flex-col">
          <CardContent className="flex flex-col w-full h-full">
            <UpcomingTask tasks={tasks} />
          </CardContent>
        </Card>

        <Card className="dark:text-white p-6 flex-1">
          <WeeklyTaskChart />
        </Card>
      </div>
    </div>
  );
}