import { useEffect, useRef, useState } from "react";
import { useWorkoutsContext } from "../../../hooks/workouts/useWorkoutsContext";
import { ResponseWorkout, Workout } from "../../../types/workout";

const WorkoutForm = () => {
  const { createWorkout, getWorkoutData, updateWorkout } = useWorkoutsContext();

  // References for form inputs
  const titleRef = useRef<HTMLInputElement>(null);
  const loadRef = useRef<HTMLInputElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Get data from context for editing
  useEffect(() => {
    const workoutData = getWorkoutData();
    if (workoutData && workoutData.id) {
      setIsEdit(true);
      if (titleRef.current) titleRef.current.value = workoutData.title || "";
      if (loadRef.current)
        loadRef.current.value = workoutData.load?.toString() || "0";
      if (repsRef.current)
        repsRef.current.value = workoutData.reps?.toString() || "0";
    } else {
      setIsEdit(false);
      if (titleRef.current) titleRef.current.value = "";
      if (loadRef.current) loadRef.current.value = "0";
      if (repsRef.current) repsRef.current.value = "0";
    }
  }, [getWorkoutData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj: Partial<Workout> = Object.fromEntries(
      formData.entries()
    );
    try {
      let response;
      if (isEdit) {
        response = await fetch(
          `http://localhost:4000/api/workouts/${getWorkoutData()?.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(formDataObj),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await fetch("http://localhost:4000/api/workouts", {
          method: "POST",
          body: JSON.stringify(formDataObj),
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
        if (titleRef.current) titleRef.current.value = "";
        if (loadRef.current) loadRef.current.value = "0";
        if (repsRef.current) repsRef.current.value = "0";
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
        ref={titleRef}
        name="title"
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>Load (kg):</label>
      <input
        type="number"
        ref={loadRef}
        name="load"
        className={emptyFields.includes("load") ? "error" : ""}
      />
      <label>Reps</label>
      <input
        type="number"
        ref={repsRef}
        name="reps"
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button type="submit">{isEdit ? "Update Workout" : "Add Workout"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
