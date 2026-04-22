import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "STUDENT" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("Registration successful");
    } catch {
      setMsg("Registration failed");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("successful") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="centered-auth">
      <div className="auth-shell panel">
        <div className="hero">
          <h1>Create Account</h1>
          <p>Register as student, faculty, or admin to access your workspace.</p>
        </div>

        <form className="form-stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              className="input"
              placeholder="Your full name"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="input"
              placeholder="yourmail@pes.edu"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="input"
              type="password"
              placeholder="Choose a secure password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="register-role">Role</label>
            <select
              id="register-role"
              className="select"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">Register</button>
          {msg ? <p className={msgClass}>{msg}</p> : null}
        </form>
      </div>
    </section>
  );
}
