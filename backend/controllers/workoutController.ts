import { Request, Response } from "express";
import pool from "../db";
import { Workout } from "../models/workout";
import { WorkoutRequest } from "../types/workout";

// GET all workouts
export const getWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await pool.query("SELECT * FROM workouts");
    const workoutsResp: Workout[] = workouts.rows;

    res.status(200).json({
      status: "success",
      data: workoutsResp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
  try {
    const newWorkout = await pool.query(
      "INSERT INTO workouts (title, reps, load) VALUES ($1, $2, $3) RETURNING *",
      [title, reps, load]
    );
    const workoutResp: Workout = newWorkout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ error: "Bad Request" });
  }
};

// DELETE a workout
export const deleteWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const trimmedId = id.trim();

  try {
    const deletedWorkout = await pool.query(
      "DELETE FROM workouts WHERE id = $1 RETURNING *",
      [trimmedId]
    );

    if (deletedWorkout.rows.length === 0) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workoutResp: Workout = deletedWorkout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad Request" });
  }
};

// UPDATE a workout
export const updateWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, reps, load }: Partial<WorkoutRequest> = req.body;

  const trimmedId = id.trim();

  try {
    const updatedWorkout = await pool.query(
      "UPDATE workouts SET title = COALESCE($1, title), reps = COALESCE($2, reps), load = COALESCE($3, load) WHERE id = $4 RETURNING *",
      [title, reps, load, trimmedId]
    );

    if (updatedWorkout.rows.length === 0) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workoutResp: Workout = updatedWorkout.rows[0];
    res.status(200).json({
      status: "success",
      data: workoutResp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad Request" });
  }
};
