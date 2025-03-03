import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Define validation schemas
const registerSchema = z.object({
  name: z.string().min(1, "Missing name"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Middleware function
const validateAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const pathSchemas: Record<string, any> = {
    "/register": registerSchema,
    "/login": loginSchema,
  };

  const schema = pathSchemas[req.path];
  if (!schema) {
    res.status(400).json({ error: "Invalid request path" });
    return;
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: result.error.format() });
    return;
  }

  next();
};

export default validateAuth;
