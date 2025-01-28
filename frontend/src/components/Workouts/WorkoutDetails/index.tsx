import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import { useWorkoutsContext } from "../../../hooks/workouts/useWorkoutsContext";
import { Workout } from "../../../types/workout";

// Date format
import { formatDistanceToNow } from "date-fns";

type WorkoutDetailsProps = {
  workout: Partial<Workout>;
};

const WorkoutDetails = (props: WorkoutDetailsProps) => {
  const { workout } = props;
  const { deleteWorkout, setWorkoutData } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user.token) return;
    const response = await fetch(
      `http://localhost:4000/api/workouts/${workout.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    await response.json();
    if (response.ok && workout.id) {
      deleteWorkout(workout.id);
    }
  };

  const handleEdit = (workout: Partial<Workout>) => {
    setWorkoutData(workout);
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.updated_at ?? ""), {
          addSuffix: true,
        })}
      </p>
      <button
        className="delete material-symbols-outlined"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        className="edit material-symbols-outlined"
        onClick={() => workout.id && handleEdit(workout)}
      >
        Edit_Square
      </button>
    </div>
  );
};

export default WorkoutDetails;
