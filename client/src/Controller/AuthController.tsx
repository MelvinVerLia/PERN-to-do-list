import AuthFinder from "../../API/AuthFinder"; 

export const registerUser = async (formData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const email = formData.email.trim();
    const password = formData.password.trim();
    const name = formData.name.trim(); 

    if (!email || !password || !name) {
      return {
        success: false,
        errors: {
          email: !email ? "Email is required." : "",
          password: !password ? "Password is required." : "",
          name: !name ? "Name is required." : "",
        },
      };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        errors: {
          email: "Email Format is incorrect",
        },
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        errors: {
          password: "Password must be at least 6 characters, genius.",
        },
      };
    }

    await AuthFinder.post("/register", { email, password, name });
    return { success: true };
  } catch (error: any) {
    const emailError = error?.response?.data?.error?.email?._errors?.[0];
    const passwordError = error?.response?.data?.error?.password?._errors?.[0]; 

    if (emailError) {
      return { success: false, error: emailError };
    }
    if (passwordError) {
      return { success: false, error: passwordError };
    }

    return { success: false, error: "Something went wrong. Try again later." };
  }
};

export const loginUser = async (formData: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const email = formData.email.trim();
    const password = formData.password.trim();
    const rememberMe = formData.rememberMe;

    if (!email || !password) {
      return {
        success: false,
        errors: {
          email: !email ? "Email is required." : "",
          password: !password ? "Password is required." : "",
        },
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        errors: {
          email: "Email Format is incorrect",
        },
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        errors: {
          password: "Password must be at least 6 characters, genius.",
        },
      };
    }

    await AuthFinder.post(
      "login",
      {
        email: email,
        password: password,
        rememberMe: rememberMe,
      },
      { withCredentials: true }
    );

    return { success: true };
  } catch (error: any) {
    const emailError = error?.response?.data?.error?.email?._errors?.[0];
    const passwordError = error?.response?.data?.error?.password?._errors?.[0]; // You were checking 'email' twice, dumbass

    if (emailError) {
      return { success: false, error: emailError };
    }
    if (passwordError) {
      return { success: false, error: passwordError };
    }
    return {
      success: false,
      error: "Something went wrong. Try again later.",
    };
  }
};
