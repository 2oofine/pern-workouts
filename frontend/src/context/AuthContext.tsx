/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState } from "react";
import { User } from "../types/auth";

export type AuthContextType = {
  user: Partial<User>;
  login: (user: Partial<User>) => void;
  signup: (user: Partial<User>) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: {},
  login: (_user: Partial<User>) => {},
  signup: (_user: Partial<User>) => {},
  logout: () => {},
});

export type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<Partial<User>>({});

  const signup = (user: Partial<User>) => {
    setAuthUser(user);
  };

  const login = (user: Partial<User>) => {
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
