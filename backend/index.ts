import express, { Express, Request, Response, NextFunction } from "express";
import workoutsRoute from "./routes/workouts";
import dotenv from "dotenv";

// INIT ENV VARIABLES
dotenv.config();

// EXPRESS APP
const app: Express = express();
const port = process.env.PORT || 4000;

// MIDDLEWARE
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ROUTES
// workouts
app.use("/api/workouts", workoutsRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});