import AuthFinder from "../../API/AuthFinder";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ReactNode } from "react";

interface Task {
  id: number;
  title: string;
  priority: number;
  deadline: string;
  description: string;
  completed: boolean;
  created_at: Date;
  category_name: string;
}

interface Chart {
  category_name: string;
  task_count: number;
}

interface TaskContextType {
  tasks: Task[];
  chart: Chart[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setChart: React.Dispatch<React.SetStateAction<Chart[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<Chart[]>([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await AuthFinder("task");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTaskCategory = async () => {
    try {
      const response = await AuthFinder("user/task/category");
      console.log("🚀 ~ fetchUserTaskCategory ~ response:", response.data);
      setChart(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserTaskCategory();
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, loading, fetchTasks, chart, setChart }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
