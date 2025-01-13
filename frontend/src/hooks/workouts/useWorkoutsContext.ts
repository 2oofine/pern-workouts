import { useContext } from "react";
import { WorkoutContext } from "../../context/WorkoutContext";

export const useWorkoutsContext = () => {
  return useContext(WorkoutContext);
};
