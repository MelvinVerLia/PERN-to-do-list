import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const DashboardSkeleton = () => {
  return (
    <div>
      <div className="flex gap-6 py-6">
        {/* Left Side */}
        <div className="flex-2">
          <Card className="p-6 h-full flex justify-center">
            <CardContent className="flex flex-col items-center">
              <Skeleton className="w-40 h-40 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex gap-4">
            <Card className="p-6">
              <CardContent className="flex flex-col items-center">
                <Skeleton className="w-40 h-40 rounded-full" />
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="flex flex-col items-center">
                <Skeleton className="w-40 h-40 rounded-full" />
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="flex flex-col items-center">
                <Skeleton className="w-40 h-40 rounded-full" />
              </CardContent>
            </Card>
          </div>

          <Card className="p-6">
            <CardContent className="flex flex-col items-center">
              <Skeleton className="w-40 h-40 rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
