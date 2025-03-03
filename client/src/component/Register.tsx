import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/Controller/AuthController";
import { useNavigate } from "react-router-dom";

interface RegisterFormState {
  email: string;
  password: string;
  name: string;
  emailError: string;
  passwordError: string;
  nameError: string;
}

const Register = () => {
  const [isEye, setEye] = useState(false);
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    password: "",
    name: "",
    emailError: "",
    passwordError: "",
    nameError: "",
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = await registerUser(form);
    if (user.success === true) {
      toast.success("Registered successfully! Muah");
      setForm({
        email: "",
        password: "",
        name: "",
        emailError: "",
        passwordError: "",
        nameError: "",
      });
      navigate("/login");
    } else {
      setForm(() => ({
        ...form,
        emailError: user.errors?.email || "",
        passwordError: user.errors?.password || "",
        nameError: user.errors?.name || "",
      }));
      toast.error("Registration failed! Try again");
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-sm"
        onSubmit={register}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Register
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Meow"
            value={form.name}
            onChange={handleInputChange}
          />
          {form.nameError && (
            <p className="text-red-600 text-sm mt-2 font-medium">
              {form.nameError}
            </p>
          )}{" "}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            value={form.email}
            onChange={handleInputChange}
          />
          {form.emailError && (
            <p className="text-red-600 text-sm mt-2 font-medium">
              {form.emailError}
            </p>
          )}{" "}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Your password
          </label>
          <div className="w-full">
            <div className="relative">
              <input
                type={isEye ? "text" : "password"}
                id="password"
                name="password"
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="******"
                value={form.password}
                onChange={handleInputChange}
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
            )}
          </div>
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
          <span className="w-full text-center">Sign Up</span>
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
