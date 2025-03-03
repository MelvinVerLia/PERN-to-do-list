import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const UnknownRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Page not found! Redirecting to login...");
    const timer = setTimeout(() => navigate("/login", { replace: true }), 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <Skeleton className="w-screen h-screen" />;
};

export default UnknownRoute;
