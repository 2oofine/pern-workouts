import { Request, Response } from "express";
import { User, UserReq } from "../models/user";
import pool from "../db";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/error";

const createToken = (id: string) => {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("No secret provided");
  }
  return jwt.sign({ id }, secret, { expiresIn: "3d" });
};

// login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let emptyFields: any = [];

    if (!email) {
      emptyFields.push("email");
    }
    if (!password) {
      emptyFields.push("password");
    }

    if (emptyFields.length > 0) {
      res.status(400).json({
        error: "Please fill in all fields",
        emptyFields,
      });
      return;
    }

    //find user in db
    const userResp = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user: User = userResp.rows[0];
    if (!user) {
      res.status(400).json({ error: "User doesn't exist" });
      return;
    }

    const matchUser = await bcrypt.compare(password, user.password);
    if (!matchUser) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = createToken(user.id);
    res.status(200).json({ status: "success", token: token });
  } catch (error) {
    handleError(error, res);
  }
};

// signup user
export const signUpUser = async (req: Request, res: Response) => {
  const { email, password }: UserReq = req.body;
  try {
    if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400).json({ error: "Password not strong enough" });
      return;
    }

    let emptyFields: any = [];

    if (!email) {
      emptyFields.push("email");
    }
    if (!password) {
      emptyFields.push("password");
    }

    if (emptyFields.length > 0) {
      res.status(400).json({
        error: "Please fill in all fields",
        emptyFields,
      });
      return;
    }

    // check if email already exists
    const userResp = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user: User = userResp.rows[0];

    if (user) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert created user into db
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    const newUserResp: User = newUser.rows[0];
    const token = createToken(newUserResp.id);

    res.status(200).json({
      status: "success",
      data: newUserResp,
      token: token,
    });
  } catch (error) {
    handleError(error, res);
  }
};
