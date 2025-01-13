import WorkoutForm from "../../components/Workouts/WorkoutForm";
import WorkoutList from "../../components/Workouts/WorkoutList";
import { WorkoutContextProvider } from "../../context/WorkoutContext";

const Home = () => {
  return (
    <div className="home">
      <WorkoutContextProvider>
        <div className="workouts">
          <WorkoutList />
        </div>
        <WorkoutForm />
      </WorkoutContextProvider>
    </div>
  );
};

export default Home;
