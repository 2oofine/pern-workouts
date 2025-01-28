import React, { useEffect, useRef } from "react";
import { useAuthLogin } from "../../../hooks/auth/useAuthContext";
import { UserResponse } from "../../../types/auth";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const { userLogin, error, emptyFields, isLoading } = useAuthLogin();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formRef.current) {
      const formData = new FormData(e.target as HTMLFormElement);
      const formDataObj: Partial<UserResponse> = Object.fromEntries(
        formData.entries()
      );
      const successLogin = await userLogin(formDataObj);
      if (successLogin) {
        formRef.current.reset();
        emailRef.current?.focus();
      }
    }
  };

  return (
    <form ref={formRef} className="signup" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <label>Email:</label>
      <input
        type="text"
        ref={emailRef}
        name="email"
        className={emptyFields.includes("email") ? "error" : ""}
      />

      <label>Passsword:</label>
      <input
        type="password"
        ref={passwordRef}
        name="password"
        className={emptyFields.includes("password") ? "error" : ""}
      />

      <div style={{ marginBottom: "1rem" }}>
        Don't have an account yet? <Link to="/signup">Sign up</Link>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default LoginForm;
