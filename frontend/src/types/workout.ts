export type Workout = {
  id: string;
  title: string;
  reps: number;
  load: number;
  created_at: string;
  updated_at: string;
};

export type ResponseWorkoutList = {
  status: string;
  data: Partial<Workout>[];
  error?: string;
};

export type ResponseWorkout = {
  status: string;
  data: Partial<Workout>;
  error?: string;
  emptyFields?: string[];
};
