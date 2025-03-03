import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

// Create the context
const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook
export function useTheme() {
  return useContext(ThemeContext);
}
