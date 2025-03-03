import "./App.css";
import Login from "./component/Login";
import Navbar from "./component/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./component/Register";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./Routes/HomePage";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import UnknownRoute from "./Routes/UnknownRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <div className="mt-16">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<HomePage />} />
            </Route>
            <Route path="*" element={<UnknownRoute />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
