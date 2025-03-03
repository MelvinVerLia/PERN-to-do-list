import { Skeleton } from "@/components/ui/skeleton";
import AuthFinder from "../../API/AuthFinder";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = async () => {
    try {
      setIsLoading(true);
      const response = await AuthFinder("auth");
      if (response.data.message === "Authenticated") {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.error("❌ ~ auth ~ error:", error);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    auth();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-screen h-screen"/>; 
  }

  return isAuth === true ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;