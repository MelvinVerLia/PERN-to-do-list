import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import InsertTask from "./InsertTask";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import { toast } from "sonner";

import AuthFinder from "../../API/AuthFinder";

interface Task {
  id: number;
  title: string;
  priority: number;
  deadline: string;
  completed: boolean;
  created_at: Date;
  category_name: string;
  description: string;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("priority-desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const markAsDone = async (task: Task) => {
    try {
      const result = await AuthFinder.put("set/complete", {
        id: task.id,
      });
      console.log(result.data);
      toast.success("Task marked as complete");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    }
  };

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => {
      if (!priorityFilter || priorityFilter === "all") return true;
      return task.priority === Number(priorityFilter);
    })
    .filter((task) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "completed") return task.completed === true;
      if (statusFilter === "pending") return task.completed === false;
      return true;
    })
    .sort((a, b) => {
      // Sort by the selected criteria
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "deadline-asc":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "deadline-desc":
          return (
            new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          );
        case "priority-asc":
          return a.priority - b.priority;
        case "priority-desc":
          return b.priority - a.priority;
        case "created-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "created-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return b.priority - a.priority; // Default to priority descending
      }
    });

  const totalPages = Math.ceil(filteredTasks.length / perPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex justify-center w-full items-center">
      <Card className="flex-none w-full container pt-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Input
              className="h-10 flex-1 min-w-[200px]"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={priorityFilter}
              onValueChange={(value) => {
                setPriorityFilter(value);
                setCurrentPage(1); // Reset to page 1 when filter changes
              }}
            >
              <SelectTrigger className="w-32 h-10 font-bold">
                <span
                  className={`
                    ${priorityFilter === "1" ? "text-green-400" : ""}
                    ${priorityFilter === "2" ? "text-orange-500" : ""}
                    ${priorityFilter === "3" ? "text-red-600" : ""}
                    ${
                      priorityFilter === "all" || !priorityFilter
                        ? "text-black dark:text-white"
                        : ""
                    }
                  `}
                >
                  {priorityFilter === "1"
                    ? "Low"
                    : priorityFilter === "2"
                    ? "Medium"
                    : priorityFilter === "3"
                    ? "High"
                    : "Priority"}
                </span>
              </SelectTrigger>
              <SelectContent className="font-bold">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem
                  value="1"
                  className="text-green-400 data-[state=checked]:text-green-400"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="2"
                  className="text-orange-500 data-[state=checked]:text-orange-500"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="3"
                  className="text-red-600 data-[state=checked]:text-red-600"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1); // Reset to page 1 when sort changes
              }}
            >
              <SelectTrigger className="w-40 h-10 font-bold">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline-asc">
                  Deadline (Earliest)
                </SelectItem>
                <SelectItem value="deadline-desc">Deadline (Latest)</SelectItem>
                <SelectItem value="priority-desc">
                  Priority (High to Low)
                </SelectItem>
                <SelectItem value="priority-asc">
                  Priority (Low to High)
                </SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="created-desc">Recently Created</SelectItem>
                <SelectItem value="created-asc">Oldest Created</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1); // Reset to page 1 when items per page changes
              }}
            >
              <SelectTrigger className="w-32 h-10 font-bold">
                <span>{perPage} per page</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset to page 1 when status filter changes
              }}
            >
              <SelectTrigger className="w-32 h-10 font-bold">
                <span
                  className={`
                  ${statusFilter === "completed" ? "text-green-600" : ""}
                  ${statusFilter === "pending" ? "text-red-600" : ""}
                  ${statusFilter === "all" ? "text-black dark:text-white" : ""}
                `}
                >
                  {statusFilter === "completed"
                    ? "Completed"
                    : statusFilter === "pending"
                    ? "Pending"
                    : "Status"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem
                  value="completed"
                  className="text-green-600 font-bold"
                >
                  Completed
                </SelectItem>
                <SelectItem value="pending" className="text-red-600 font-bold">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>

            <InsertTask />
          </div>

          {paginatedTasks.length > 0 && (
            <ul className="space-y-3">
              <li className="p-3 border rounded-md shadow-sm flex justify-between w-full font-bold mb-3">
                <span className="flex-1 text-center">Task Title</span>
                <span className="flex-1 text-center">Category</span>
                <span className="flex-1 text-center">Created Date</span>
                <span className="flex-1 text-center">Deadline</span>
                <span className="flex-1 text-center">Priority</span>
                <span className="flex-1 text-center">Status</span>
              </li>
            </ul>
          )}

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <ul className="space-y-3">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-3 border rounded-md shadow-sm flex flex-wrap md:flex-nowrap items-center w-full 
                    hover:cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-200 transition duration-300"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsOpen(true);
                    }}
                  >
                    <span className="w-full md:w-1/5 text-center md:text-left font-medium">
                      {task.title}
                    </span>
                    <span className="w-1/2 md:w-1/5 text-center">
                      {task.category_name || "Uncategorized"}
                    </span>
                    <span className="w-1/2 md:w-1/5 text-center">
                      {formatDate(task.created_at)}
                    </span>
                    <span className="w-1/2 md:w-1/5 text-center">
                      {formatDate(task.deadline)}
                    </span>
                    <span
                      className={`w-1/2 md:w-1/5 text-center font-medium ${
                        priorityLabels[task.priority]?.color || "text-gray-500"
                      }`}
                    >
                      {priorityLabels[task.priority]?.text || "Unknown"}
                    </span>
                    <span
                      className={`w-full md:w-1/5 text-center font-medium ${
                        task.completed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </li>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg font-semibold">No tasks found</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </ul>

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
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            selectedTask.completed
                              ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
                              : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {selectedTask.completed ? "Completed" : "Pending"}
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

                    {!selectedTask.completed && (
                      <Button
                        variant="outline"
                        onClick={() => markAsDone(selectedTask)}
                        className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 hover:cursor-pointer"
                      >
                        Mark as Done
                      </Button>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {paginatedTasks.length > 0 && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, filteredTasks.length)} of{" "}
                {filteredTasks.length} tasks
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="hover:cursor-pointer"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  First
                </Button>
                <Button
                  className="hover:cursor-pointer"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Prev
                </Button>
                <span className="mx-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  className="hover:cursor-pointer"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
                <Button
                  className="hover:cursor-pointer"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
