import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import pool from "../db";
import { handleError } from "../utils/error";

export interface AuthenticatedRequest extends Request {
  user: User;
}

export const requireAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  //verify token
  if (!authorization) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("No secret provided");
    }
    const decodedToken = jwt.verify(token, secret);
    const { id } = decodedToken as { id: string };

    const userResp = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = userResp.rows[0];

    if (!user) {
      res.status(401).json({ error: "User not authorized" });
      return;
    }

    (req as AuthenticatedRequest).user = user;

    next();
  } catch (error) {
    handleError(error, res);
  }
};
