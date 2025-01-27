/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState } from "react";
import { Workout } from "../types/workout";

export type WorkoutContextType = {
  workouts: Partial<Workout>[];
  createWorkout: (workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  getWorkoutData: () => Partial<Workout> | undefined;
  getWorkouts: () => Partial<Workout>[];
  setWorkoutsList: (workouts: Partial<Workout>[]) => void;
  setWorkoutData: (workout: Partial<Workout>) => void;
};

export const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  createWorkout: (_workout: Partial<Workout>) => {},
  deleteWorkout: (_id: string) => {},
  updateWorkout: (_id: string, _workout: Partial<Workout>) => {},
  getWorkoutData: () => undefined,
  getWorkouts: () => [],
  setWorkoutsList: (_workouts: Partial<Workout>[]) => {},
  setWorkoutData: (_workout: Partial<Workout>) => {},
});

export type WorkoutContextProviderProps = {
  children: React.ReactNode;
};

export const WorkoutContextProvider = ({
  children,
}: WorkoutContextProviderProps) => {
  const [workouts, setWorkouts] = useState<Partial<Workout>[]>([]);
  const [workout, setWorkout] = useState<Partial<Workout>>({});

  const createWorkout = (workout: Partial<Workout>) => {
    setWorkouts((prevWorkouts) =>
      [...prevWorkouts, workout].sort((a, b) => {
        const dateA = new Date(a.created_at || "").getTime();
        const dateB = new Date(b.created_at || "").getTime();
        return dateB - dateA;
      })
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w.id !== id));
  };

  const updateWorkout = (id: string, workout: Partial<Workout>) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((w) => (w.id === id ? { ...w, ...workout } : w))
    );
    setWorkout({});
  };

  const getWorkoutData = (): Partial<Workout> => {
    return workout;
  };

  const getWorkouts = (): Partial<Workout>[] => {
    return workouts;
  };

  const setWorkoutsList = (workouts: Partial<Workout>[]) => {
    setWorkouts(workouts);
  };

  const setWorkoutData = (workout: Partial<Workout>) => {
    setWorkout(workout);
  };

  const workoutContextValue: WorkoutContextType = {
    workouts,
    createWorkout,
    deleteWorkout,
    updateWorkout,
    getWorkoutData,
    getWorkouts,
    setWorkoutsList,
    setWorkoutData,
  };

  return (
    <WorkoutContext.Provider value={workoutContextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};
