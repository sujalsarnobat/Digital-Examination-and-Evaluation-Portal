import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setBasicAuth } from "../services/api";
import { getDefaultRouteForRole } from "../config/roleAccess";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      setBasicAuth(email, password);
      localStorage.setItem("auth", JSON.stringify({ email, role: res.data.role }));
      setMsg("Login successful");
      navigate(getDefaultRouteForRole(res.data.role));
    } catch {
      setMsg("Invalid credentials");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("successful") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="centered-auth">
      <div className="auth-shell panel">
        <div className="hero">
          <h1>Welcome Back</h1>
          <p>Sign in to create exams, evaluate answers, and publish results.</p>
        </div>

        <form className="form-stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              placeholder="faculty@pes.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit">Login</button>
          {msg ? <p className={msgClass}>{msg}</p> : null}
        </form>
      </div>
    </section>
  );
}
