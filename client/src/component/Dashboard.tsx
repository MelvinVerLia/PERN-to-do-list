import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/Context/ThemeContext";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CategoryChart from "./CategoryChart";
import WeeklyTaskChart from "./WeeklyTaskChart";
import UpcomingTask from "./UpcomingTask";

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

  return (
    <div className="flex gap-6 py-6 w-full px-6">
      {/* Left Side (One Card) */}
      <div className="flex flex-1 basis-1/4">
        <Card className="dark:text-white p-6 h-full w-full flex justify-center">
          <CardContent className="flex flex-col items-center">
            <div>
              <CircularProgressbar
                value={progress}
                text={`${completed} / ${totalTasks} Done`}
                styles={buildStyles({
                  textColor: isDark ? "#fff" : "#333",
                  pathColor: isDark ? "#8B5CF6" : "#4F46E5",
                  trailColor: isDark ? "#374151" : "#E5E7EB",
                  textSize: "15px",
                })}
              />
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
