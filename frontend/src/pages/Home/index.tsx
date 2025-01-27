import WorkoutForm from "../../components/Workouts/WorkoutForm";
import WorkoutList from "../../components/Workouts/WorkoutList";

const Home = () => {
  return (
    <div className="home">
      <div className="workouts">
        <WorkoutList />
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
