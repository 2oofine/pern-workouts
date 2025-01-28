import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import Home from "../pages/Home";

const AppRoutes = () => {
  const { user } = useAuthContext();
  const hasUser = Object.keys(user).length;

  return (
    <Routes>
      <Route path="/" element={hasUser ? <Home /> : <Navigate to="/login" />} />

      <Route
        path="/login"
        element={!hasUser ? <LoginForm /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!hasUser ? <SignupForm /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRoutes;
