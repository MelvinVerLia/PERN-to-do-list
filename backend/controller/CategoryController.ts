import { Request, Response } from "express";
import { selectAllCategories } from "../repository/CategoryRepository";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await selectAllCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
  }
};
