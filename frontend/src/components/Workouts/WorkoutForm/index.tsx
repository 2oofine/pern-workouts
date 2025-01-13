import { useState, useEffect } from "react";
import { ResponseWorkout, Workout } from "../../../types/workout";
import { useWorkoutsContext } from "../../../hooks/workouts/useWorkoutsContext";

const WorkoutForm = () => {
  const { createWorkout, getWorkoutData, updateWorkout } = useWorkoutsContext();
  const [formDetails, setFormDetails] = useState<Partial<Workout>>({
    title: "",
    reps: 0,
    load: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Get data from context for editing
  useEffect(() => {
    const workoutData = getWorkoutData();
    if (workoutData && workoutData.id) {
      setIsEdit(true);
      setFormDetails({
        title: workoutData.title || "",
        reps: workoutData.reps || 0,
        load: workoutData.load || 0,
      });
    } else {
      setIsEdit(false);
    }
  }, [getWorkoutData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response;
      if (isEdit) {
        response = await fetch(
          `http://localhost:4000/api/workouts/${getWorkoutData()?.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(formDetails),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await fetch("http://localhost:4000/api/workouts", {
          method: "POST",
          body: JSON.stringify(formDetails),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const json: ResponseWorkout = await response.json();
      if (!response.ok) {
        setError(json.error || "Something went wrong");
        setEmptyFields(json.emptyFields || []);
      } else {
        setError(null);
        setEmptyFields([]);
        if (isEdit) {
          const workoutId = getWorkoutData()?.id;
          if (workoutId) {
            updateWorkout(workoutId, json.data);
          }
        } else {
          createWorkout(json.data);
        }
        setFormDetails({ title: "", reps: 0, load: 0 }); //reset form
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form action="" className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) =>
          setFormDetails({ ...formDetails, title: e.target.value })
        }
        value={formDetails.title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>Load (kg):</label>
      <input
        type="number"
        onChange={(e) =>
          setFormDetails({ ...formDetails, load: Number(e.target.value) })
        }
        value={formDetails.load}
        className={emptyFields.includes("load") ? "error" : ""}
      />
      <label>Reps</label>
      <input
        type="number"
        onChange={(e) =>
          setFormDetails({ ...formDetails, reps: Number(e.target.value) })
        }
        value={formDetails.reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button type="submit">{isEdit ? "Update Workout" : "Add Workout"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
