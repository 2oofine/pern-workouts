/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useWorkoutsContext } from "../../../hooks/workouts/useWorkoutsContext";
import WorkoutDetails from "../WorkoutDetails";
import { ResponseWorkoutList } from "../../../types/workout";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";

const WorkoutList = () => {
  const { workouts, setWorkoutsList } = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/workouts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json: ResponseWorkoutList = await response.json();
        if (response.ok) {
          setWorkoutsList(json.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="workouts">
      {workouts &&
        workouts.map((workout) => (
          <WorkoutDetails key={workout.id} workout={workout} />
        ))}
    </div>
  );
};

export default WorkoutList;
