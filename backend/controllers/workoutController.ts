import { Request, Response } from "express";
import pool from "../db";
import { Workout } from "../models/workout";
import { WorkoutRequest } from "../types/workout";
import { handleError } from "../utils/error";

// GET all workouts
export const getWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await pool.query(
      "SELECT * FROM workouts ORDER BY created_at DESC"
    );
    const workoutsResp: Workout[] = workouts.rows;

    res.status(200).json({
      status: "success",
      data: workoutsResp,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// GET a single workout
export const getWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const trimmedId = id.trim();
  try {
    const workout = await pool.query("SELECT * FROM workouts WHERE id = $1", [
      trimmedId,
    ]);

    if (workout.rows.length === 0) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workoutResp: Workout = workout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad Request" });
  }
};

// CREATE a new workout
export const createWorkout = async (req: Request, res: Response) => {
  const { title, reps, load }: WorkoutRequest = req.body;

  let emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    res.status(400).json({
      error: "Please fill in all fields",
      emptyFields,
    });
    return;
  }

  try {
    const workout = await pool.query(
      "INSERT INTO workouts (title, reps, load) VALUES ($1, $2, $3) RETURNING *",
      [title, reps, load]
    );
    const workoutResp: Workout = workout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE a workout
export const deleteWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const trimmedId = id.trim();

  try {
    const workout = await pool.query(
      "DELETE FROM workouts WHERE id = $1 RETURNING *",
      [trimmedId]
    );

    if (workout.rows.length === 0) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workoutResp: Workout = workout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// UPDATE a workout
export const updateWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, reps, load }: Partial<WorkoutRequest> = req.body;

  const trimmedId = id.trim();

  let emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    res.status(400).json({
      error: "Please fill in all fields",
      emptyFields,
    });
    return;
  }

  try {
    const workout = await pool.query(
      "UPDATE workouts SET title = COALESCE($1, title), reps = COALESCE($2, reps), load = COALESCE($3, load), updated_at = NOW() WHERE id = $4 RETURNING *",
      [title, reps, load, trimmedId]
    );

    if (workout.rows.length === 0) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workoutResp: Workout = workout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    handleError(error, res);
  }
};
