import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserResponse } from "../../types/auth";
import { useWorkoutsContext } from "../workouts/useWorkoutsContext";

export const useAuthContext = () => {
  return useContext(AuthContext);
};

//sign up
export const useAuthSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const { signup, user } = useAuthContext();
  const userSignup = async (userSignup: Partial<UserResponse>) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        body: JSON.stringify(userSignup),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });

      const json: UserResponse = await response.json();
      if (!response.ok) {
        setIsLoading(false);

        setError(json.error || "Something went wrong");
        setEmptyFields(json.emptyFields || []);
        return json.status === "success" ? true : false;
      } else {
        setError(null);
        setEmptyFields([]);

        const { data, token } = json;
        localStorage.setItem("user", JSON.stringify({ token, data }));
        signup(json);

        setIsLoading(false);
        return json.status === "success" ? true : false;
      }
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  return { userSignup, isLoading, error, emptyFields };
};

//logout
export const useAuthLogout = () => {
  const { logout } = useAuthContext();
  const { setWorkoutsList } = useWorkoutsContext();

  const userLogout = () => {
    localStorage.removeItem("user");
    setWorkoutsList([]);
    logout();
  };

  return { userLogout };
};

//login
export const useAuthLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const { login, user } = useAuthContext();
  const userLogin = async (userLogin: Partial<UserResponse>) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        body: JSON.stringify(userLogin),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json: UserResponse = await response.json();
      if (!response.ok) {
        setIsLoading(false);

        setError(json.error || "Something went wrong");
        setEmptyFields(json.emptyFields || []);
        return json.status === "success" ? true : false;
      } else {
        setError(null);
        setEmptyFields([]);

        const { data, token } = json;
        localStorage.setItem("user", JSON.stringify({ token, data }));

        login(json);

        setIsLoading(false);
        return json.status === "success" ? true : false;
      }
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  return { userLogin, isLoading, error, emptyFields };
};
