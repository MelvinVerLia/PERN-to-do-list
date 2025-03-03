import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthFinder from "../../API/AuthFinder";
import { toast } from "sonner";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  priority: number;
  deadline: string;
  description: string;
  completed: boolean;
  category_name: string;
  created_at: Date;
}

interface UpcomingProps {
  tasks: Task[];
}
const UpcomingTask = ({ tasks }: UpcomingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const markAsDone = async (task: Task) => {
    try {
      const result = await AuthFinder.put("set/complete", {
        id: task.id,
      });
      console.log(result.data);
      toast.success("Task marked as complete")
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const priorityLabels: Record<
    number,
    {
      text: string;
      color: string;
      bgColor: string;
      darkBgColor: string;
      darkColor: string;
    }
  > = {
    1: {
      text: "Low",
      color: "text-green-500",
      bgColor: "bg-green-200",
      darkBgColor: "dark:bg-green-900",
      darkColor: "dark:text-green-300",
    },
    2: {
      text: "Medium",
      color: "text-yellow-500",
      bgColor: "bg-orange-400",
      darkBgColor: "dark:bg-orange-500",
      darkColor: "dark:text-orange-500",
    },
    3: {
      text: "High",
      color: "text-red-600",
      bgColor: "bg-red-200",
      darkBgColor: "dark:bg-red-900",
      darkColor: "dark:text-red-300",
    },
  };

  const sortedTasks = tasks
    .filter(
      (task) =>
        new Date(task.deadline) >= new Date() && task.completed === false
    ) // Ignore past deadlines
    .sort((a, b) => {
      // Sort by priority (higher numbers first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // If priority is the same, sort by deadline (earlier is first)
      if (new Date(a.deadline).getTime() !== new Date(b.deadline).getTime()) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // If both priority and deadline are the same, sort by title (or id)
      return a.title.localeCompare(b.title); // Sort alphabetically as a last resort
    })
    .slice(0, 3);

  const mostUrgentTask = sortedTasks[0]; // The top urgent task

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {mostUrgentTask ? (
        <>
          <h3 className="text-lg font-medium mb-3 text-center">
            Upcoming Tasks
          </h3>
          {/* Top Urgent Task */}
          <div
            className="mb-2 p-3 border-2 border-red-500 rounded-md bg-red-200 dark:hover:bg-red-800/30 hover:bg-red-300 transition-all duration-400 dark:bg-red-900/20 shadow-sm hover:cursor-pointer"
            onClick={() => {
              setSelectedTask(mostUrgentTask);
              setIsOpen(true);
            }}
          >
            <p className="font-semibold">{mostUrgentTask.title}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-800/30 text-red-800  dark:text-red-300">
                {formatDate(mostUrgentTask.deadline)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  mostUrgentTask.priority === 3
                    ? "bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300"
                    : mostUrgentTask.priority === 2
                    ? "bg-orange-100 dark:bg-orange-800/30 text-orange-800 dark:text-orange-300"
                    : "bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300"
                }`}
              >
                {mostUrgentTask.priority === 3
                  ? "High"
                  : mostUrgentTask.priority === 2
                  ? "Medium"
                  : "Low"}
              </span>
            </div>
          </div>

          {/* Upcoming Tasks List (Flex Grow Here) */}
          <div className="space-y-2 overflow-auto flex-grow">
            {sortedTasks.slice(1).map((task) => (
              <div
                key={task.id}
                className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 rounded-md bg-white dark:bg-gray-800/50  dark:hover:bg-gray-800 transition-all duration-400 shadow-sm hover:cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  setIsOpen(true);
                }}
              >
                <p className="font-medium text-sm">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {formatDate(task.deadline)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 3
                        ? "bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300"
                        : task.priority === 2
                        ? "bg-orange-100 dark:bg-orange-800/30 text-orange-800 dark:text-orange-300"
                        : "bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300"
                    }`}
                  >
                    {task.priority === 3
                      ? "High"
                      : task.priority === 2
                      ? "Medium"
                      : "Low"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 rounded-lg shadow-lg w-full max-w-md dark:border-gray-700">
              {selectedTask && (
                <>
                  <div
                    className={`p-4 ${
                      priorityLabels[selectedTask.priority]?.bgColor ||
                      "bg-gray-100"
                    } 
                    ${
                      priorityLabels[selectedTask.priority]?.darkBgColor ||
                      "dark:bg-gray-800"
                    } rounded-t-lg`}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-black dark:text-white">
                        {selectedTask.title}
                      </DialogTitle>
                      <div className="mt-2 flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            priorityLabels[selectedTask.priority]?.color ||
                            "text-gray-500"
                          } 
                          ${
                            priorityLabels[selectedTask.priority]?.darkColor ||
                            "dark:text-gray-400"
                          } 
                          bg-white dark:bg-gray-700`}
                        >
                          {priorityLabels[selectedTask.priority]?.text ||
                            "Unknown"}{" "}
                          Priority
                        </span>
                      </div>
                    </DialogHeader>
                  </div>

                  <div className="p-6 dark:bg-gray-900 bg-gray-100">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-400 mb-2">
                        Description
                      </h3>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                        {selectedTask.description ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-400 mb-1 flex items-center">
                          <TagIcon className="h-3 w-3 mr-1" /> Category
                        </span>
                        <span className="font-semibold text-sm dark:text-gray-300 text-gray-700 ">
                          {selectedTask.category_name || "Uncategorized"}
                        </span>
                      </div>

                      <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-400 mb-1 flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" /> Created
                        </span>
                        <span className="font-semibold text-sm dark:text-gray-300 text-gray-700">
                          {formatDate(selectedTask.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border dark:border-gray-700 flex items-center mb-6">
                      
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <div>
                        <span className="text-xs font-medium dark:text-gray-400 text-gray-800">
                          Deadline
                        </span>
                        <p className="font-semibold dark:text-gray-300 text-gray-700">
                          {formatDate(selectedTask.deadline)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => markAsDone(selectedTask)}
                      className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 hover:cursor-pointer"
                    >
                      Mark as Done
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      ) : (
        /* Empty State (Centered) */
        <div className="h-full flex flex-col items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            All caught up!
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTask;
