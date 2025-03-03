import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "@/Controller/AuthController";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  interface LoginFormState {
    email: string;
    password: string;
    emailError: string;
    passwordError: string;
    rememberMe: boolean;
  }
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    rememberMe: false,
  });
  const [isEye, setEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const user = await loginUser(form);

      if (user.success === true) {
        navigate("/dashboard");
        toast.success("Login successfully! Muah");
        setForm({
          email: "",
          password: "",
          emailError: "",
          passwordError: "",
          rememberMe: false,
        });
      } else {
        setForm(() => ({
          ...form,
          emailError: user.errors?.email || "",
          passwordError: user.errors?.password || "",
        }));
        toast.error("Login failed! Try again");
      }
    } catch (error) {
      toast.error("Login failed! Try again, dumbass.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-sm"
        onSubmit={submitHandler}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="example@gmail.com"
          />
          {form.emailError && (
            <p className="text-red-600 text-sm mt-2 font-medium">
              {form.emailError}
            </p>
          )}{" "}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Your password
          </label>
          <div className="w-full">
            <div className="relative">
              <input
                type={isEye ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="******"
              />
              <button
                type="button"
                onClick={() => setEye((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 dark:text-gray-300"
              >
                {isEye ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {form.passwordError && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {form.passwordError}
              </p>
            )}{" "}
          </div>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="remember"
            type="checkbox"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg flex items-center text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 relative
            ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading && (
            <Loader2 className="h-6 w-6 animate-spin absolute left-2" />
          )}
          <span className="w-full text-center">Sign In</span>
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
          If you don't have an account,{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
