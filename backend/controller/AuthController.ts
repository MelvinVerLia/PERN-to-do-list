import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail, insertUser } from "../repository/AuthRepository";
import jwtGenerator from "../Utils/JwtGenerator";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = jwtGenerator(user.id);
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Only sends cookie over HTTPS in production
      sameSite: "lax", // Prevents CSRF
      maxAge: rememberMe ? 24 * 60 * 60 * 1000 : undefined,
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (user) {
      res.status(400).json("Email already exists");
      return;
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPass = await bcrypt.hash(password, salt);

    const newUser = await insertUser(email, bcryptPass, name);

    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.json("Server Error").status(500);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    console.log("hi");
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
  }
};
