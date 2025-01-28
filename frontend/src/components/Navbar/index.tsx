import { Link } from "react-router-dom";
import { useAuthContext, useAuthLogout } from "../../hooks/auth/useAuthContext";

const Navbar = () => {
  const { userLogout } = useAuthLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>PERN Workouts</h1>
        </Link>
        <nav>
          {Object.keys(user).length ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span>{user.data?.email}</span>
              <div className="">
                <button onClick={handleLogout}>Log out</button>
              </div>
            </div>
          ) : (
            <div className="">
              <Link to="/login">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
