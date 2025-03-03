import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import AuthFinder from "../../API/AuthFinder";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTask } from "@/Context/TaskContext";

interface Category {
  id: string;
  name: string;
}

interface Priority {
  value: number;
  label: string;
  color: string;
}

const InsertTask = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setTasks } = useTask();

  const priorities: Priority[] = [
    { value: 1, label: "Low", color: "text-blue-600 font-bold" },
    { value: 2, label: "Medium", color: "text-yellow-600 font-bold" },
    { value: 3, label: "High", color: "text-red-600 font-bold" },
  ];

  const addTask = async (e: React.FormEvent) => {
    if (isSubmitting) return;
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const taskData = {
        categoryId: selectedCategory,
        title: title,
        priority: selectedPriority,
        description: description,
        deadline: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
      };

      const response = await AuthFinder.post("insert", {
        data: taskData,
      });

      resetForm();
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(response.data);
      setTasks((prevTasks) => [...prevTasks, response.data]); // Add new task to state
      toast.success("Task added succesfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task:");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    setSelectedPriority("");
    setSelectedDate(undefined);
  };

  const getAllCategories = async () => {
    try {
      const response = await AuthFinder("category");
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-6 right-6 w-20 h-20 rounded-full p-0 flex items-center justify-center 
  bg-gradient-to-br from-indigo-500 to-purple-700 shadow-2xl 
  hover:from-indigo-400 hover:to-purple-600 transition-all duration-300 ease-in-out
  border border-indigo-400/30 backdrop-blur-md hover:cursor-pointer animate-dance text-gray-100 hover:text-gray-200"
          >
            <PlusCircle className="size-12/12" />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[500px] rounded-xl shadow-xl border-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl text-gray-800 dark:text-gray-200 font-bold">
            Create a new task
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-1">
          <div className="grid gap-2 mt-2">
            <Label
              htmlFor="title"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task details"
              className="rounded-lg border-gray-300 min-h-24 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="category"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="rounded-lg border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-lg font-bold">
                  <SelectGroup>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="priority"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Priority
              </Label>
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="rounded-lg border-gray-300">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectGroup>
                    {priorities.map((priority) => (
                      <SelectItem
                        key={priority.value}
                        value={priority.value.toString()}
                        className={`my-1 rounded ${priority.color} px-2 py-1`}
                      >
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-2 mt-2">
          <Label
            htmlFor="deadline"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Deadline
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) =>
                  setSelectedDate(addDays(new Date(), parseInt(value)))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={addTask}
            className="rounded-lg bg-indigo-700 hover:bg-indigo-600 dark:text-white hover:cursor-pointer"
            disabled={
              !title ||
              !selectedCategory ||
              !selectedPriority ||
              !selectedDate ||
              isSubmitting
            }
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsertTask;
