import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController";

const router = Router();

// GET all workouts
router.get("/", getWorkouts);

// GET single workout
router.get("/:id", getWorkout);

// CREATE new workout
router.post("/", createWorkout);

// DELETE workout
router.delete("/:id", deleteWorkout);

// UPDATE workout
router.patch("/:id", updateWorkout);

export default router;
