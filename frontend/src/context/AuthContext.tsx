/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useState } from "react";
import { UserResponse } from "../types/auth";

export type AuthContextType = {
  user: Partial<UserResponse>;
  login: (user: Partial<UserResponse>) => void;
  signup: (user: Partial<UserResponse>) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: {},
  login: (_user: Partial<UserResponse>) => {},
  signup: (_user: Partial<UserResponse>) => {},
  logout: () => {},
});

export type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<Partial<UserResponse>>({});

  useEffect(() => {
    //initial user when logged in
    const userAuth = localStorage.getItem("user");
    const jsonUser: UserResponse = userAuth ? JSON.parse(userAuth) : {};

    login(jsonUser);
  }, []);

  const signup = (user: Partial<UserResponse>) => {
    setAuthUser(user);
  };

  const login = (user: Partial<UserResponse>) => {
    setAuthUser(user);
  };

  const logout = () => {
    setAuthUser({});
  };

  const authContextValue: AuthContextType = {
    user: authUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
