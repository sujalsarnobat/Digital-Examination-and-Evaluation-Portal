import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  ROLE_ACCESS,
  getAuthFromStorage,
  getRoleFromAuth
} from "../config/roleAccess";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = getAuthFromStorage();
  const role = getRoleFromAuth(auth);
  const items = ROLE_ACCESS[role] || [];

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to={auth ? "/dashboard" : "/"}>
          <span className="brand-dot" />
          <span className="brand-title">Digital Exam Portal</span>
        </Link>

        <div className="nav-links">
          {auth ? (
            <>
              <NavLink className={navClass} to="/dashboard">Home</NavLink>
              <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>
              {items.map((item) => (
                <NavLink className={navClass} to={item.path} key={item.path}>{item.label}</NavLink>
              ))}
            </>
          ) : (
            <>
              <NavLink className={navClass} to="/">Home</NavLink>
              <NavLink className={navClass} to="/login">Login</NavLink>
              <NavLink className={navClass} to="/register">Register</NavLink>
            </>
          )}
        </div>

        <div className="nav-actions">
          {auth ? (
            <>
              <span className="role-badge">User: {role}</span>
              <button className="btn btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
