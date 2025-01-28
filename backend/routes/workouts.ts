import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController";

import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// require auth for workout routes
router.use(requireAuth);

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
