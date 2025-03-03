import React, { useEffect } from "react";
import Dashboard from "../component/Dashboard";
import TaskList from "@/component/TaskList";
import TaskListSkeleton from "@/component/TaskListSkeleton"; 
import DashboardSkeleton from "@/component/DashboardSkeleton";
import { useTask } from "@/Context/TaskContext";

const HomePage = () => {
  const { tasks, loading, fetchTasks } = useTask();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto">
      {loading ? (
        <>
          <DashboardSkeleton />
          <TaskListSkeleton />
        </>
      ) : (
        <>
          <Dashboard tasks={tasks} />
          <TaskList tasks={tasks} />
        </>
      )}
    </div>
  );
};

export default HomePage;
