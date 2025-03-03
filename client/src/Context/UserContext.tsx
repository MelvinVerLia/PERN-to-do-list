import React, { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define the types for context value
interface UserContextType {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log(decoded.id);
        setUserId(decoded.id);
      } catch (error) {
        console.log("Error decoding token:", error);
      }
    }
  }, [setUserId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
