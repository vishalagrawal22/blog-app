import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import UserContext from "../../UserContext";

function AuthSection() {
  const { user, clearAccessToken } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
      method: "DELETE",
      credentials: "include",
    });
    clearAccessToken();
    navigate("/");
  }

  if (!user) {
    return (
      <ul className="nav">
        <li className="nav-item">
          <Link to="/login" className="btn btn-secondary me-3">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className="nav">
        <li className="nav-item">
          <Link to={`/users/${user.id}`} className="fs-4 me-3 text-secondary">
            {user.name}
          </Link>
        </li>
        <li className="nav-item">
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    );
  }
}

export default function Header() {
  const { isLoading } = useContext(UserContext);
  return (
    <header>
      <nav className="navbar navbar-light bg-light px-3">
        <Link to="/" className="fs-1 navbar-brand">
          Blog
        </Link>
        {!isLoading && <AuthSection />}
      </nav>
    </header>
  );
}
