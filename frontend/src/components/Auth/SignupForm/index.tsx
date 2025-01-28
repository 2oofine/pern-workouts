import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthSignup } from "../../../hooks/auth/useAuthContext";
import { UserResponse } from "../../../types/auth";

const SignupForm = () => {
  const { isLoading, emptyFields, error, userSignup } = useAuthSignup();

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
      const signupStatus = await userSignup(formDataObj);
      if (signupStatus) {
        formRef.current.reset();
        emailRef.current?.focus();
      }
    }
  };

  return (
    <form ref={formRef} className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
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
        Already registered? <Link to="/login">Log in</Link>
      </div>
      <button type="submit" disabled={isLoading}>
        Sign up
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default SignupForm;
