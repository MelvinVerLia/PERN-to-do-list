import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TaskListSkeleton = () => {
  return (
    <div>
      <div className="flex justify-center w-full items-center">
        <Card className="flex-none w-full container pt-0">
          <CardContent className="p-4">
            {/* Search and Filters */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Table Header */}
            <ul className="space-y-3">
              <li className="p-3 border rounded-md shadow-sm flex justify-between w-full font-bold">
                <span className="flex-1 text-center">Task Title</span>
                <span className="flex-1 text-center">Created Date</span>
                <span className="flex-1 text-center">Deadline</span>
                <span className="flex-1 text-center">Priority</span>
                <span className="flex-1 text-center">Status</span>
              </li>
            </ul>

            {/* Loading Skeleton Rows */}
            <ul className="space-y-3 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className="p-3 border rounded-md shadow-sm flex justify-between w-full"
                >
                  <Skeleton className="flex-1 h-5 mx-auto" />
                  <Skeleton className="flex-1 h-5 mx-auto" />
                  <Skeleton className="flex-1 h-5 mx-auto" />
                  <Skeleton className="flex-1 h-5 mx-auto" />
                  <Skeleton className="flex-1 h-5 mx-auto" />
                </li>
              ))}
            </ul>

            {/* Pagination Skeleton */}
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-10 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskListSkeleton;
