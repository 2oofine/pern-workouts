import { DatabaseError } from "pg";
import { Response } from "express";
export const handleError = (error: unknown, res: Response) => {
  if (error instanceof DatabaseError) {
    console.log(error);
    res.status(400).json({ error: error.detail });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};
