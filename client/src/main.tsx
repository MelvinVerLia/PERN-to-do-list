import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./Context/ThemeContext.tsx";
import UserContextProvider from "./Context/UserContext.tsx";
import { TaskProvider } from "./Context/TaskContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider>
    <TaskProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </TaskProvider>
  </ThemeProvider>
  // </StrictMode>
);
