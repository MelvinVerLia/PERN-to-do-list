import cors from "cors";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import valid from "./middleware/Valid";
import query from "./db/index";
import jwtGenerator from "./Utils/JwtGenerator";
import bcrypt from "bcrypt";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "./controller/AuthController";
import {
  getAllTasks,
  addTask,
  userTaskCategory,
  setComplete,
  trackUserTaskCount,
} from "./controller/TaskController";
import { authorize } from "./middleware/Authorization";
import cookieParser from "cookie-parser";
import { getAllCategories } from "./controller/CategoryController";

dotenv.config();

const app: Express = express();

app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //making sure the cookie can be used bruh
  })
); // Allows cross-origin requests

app.use(express.json()); // Allows parsing JSON body requests

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/insert", authorize, addTask);
app.get("/task", authorize, getAllTasks);
app.post("/register", valid, registerUser);
app.post("/login", valid, loginUser);

app.get("/auth", authorize, (req: Request, res: Response) => {
  const message = "Authenticated";
  res.json({ message: message });
  console.log(message);
});

app.delete("/logout", logoutUser);

app.get("/category", getAllCategories);

app.get("/user/task/category", authorize, userTaskCategory);

app.get("/task/count", authorize, trackUserTaskCount);

app.put("/set/complete", authorize, setComplete);
