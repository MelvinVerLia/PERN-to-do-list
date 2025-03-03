import React, { useEffect, useState } from "react";
import { useTheme } from "@/Context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import AuthFinder from "../../API/AuthFinder";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, toggleHamburger] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await AuthFinder.delete("logout");
      console.log("🚀 ~ logout ~ response:", response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Give Me Money
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center px-1 transition-all">
                  {/* Moon Icon - Dark Mode */}
                  <Moon
                    className={`h-4 w-4 text-gray-400 transition-opacity absolute left-1 z-10${
                      isDark ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {/* Sun Icon - Light Mode */}
                  <Sun
                    className={`h-4 w-4 text-yellow-500 transition-opacity absolute right-1 z-10${
                      isDark ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  {/* Toggle Ball */}
                  <div
                    className={`absolute top-0.5 h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform ${
                      isDark ? "translate-x-full" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
            <button
              onClick={() => toggleHamburger(true)}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
