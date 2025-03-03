import { Request, Response } from "express";
import {
  selectAllTasks,
  insertTask,
  selectUserTaskCategory,
  selectTaskCount,
  updateCompleted,
} from "../repository/TaskRepository";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string;
}

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const tasks = await selectAllTasks(req.user);
    res.json(tasks);
  } catch (error) {
    res.json("Server Error").status(500);
  }
};

export const addTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user as string;
  const category_id = req.body.data.categoryId;
  const title = req.body.data.title;
  const description = req.body.data.description;
  const priority = req.body.data.priority;
  const deadline = req.body.data.deadline;

  try {
    const newTask = await insertTask(
      title,
      userId,
      category_id,
      deadline,
      priority,
      description
    );

    res.json(newTask);
  } catch (error) {
    console.log(error);
    res.json("Server Error").status(500);
  }
};

export const userTaskCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const userTaskCategory = await selectUserTaskCategory(req.user);
    res.json(userTaskCategory);
  } catch (error) {
    res.json("Server Error").status(500);
  }
};

export const trackUserTaskCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const response = await selectTaskCount(req.user);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export const setComplete = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const response = await updateCompleted(req.user, req.body.id);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
