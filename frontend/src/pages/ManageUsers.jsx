import { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "STUDENT" });
  const [msg, setMsg] = useState("");

  const loadUsers = () => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("User created successfully");
      setForm({ fullName: "", email: "", password: "", role: "STUDENT" });
      loadUsers();
    } catch {
      setMsg("Failed to create user");
    }
  };

  const msgClass = msg
    ? `status ${msg.toLowerCase().includes("success") ? "status-success" : "status-error"}`
    : "";

  return (
    <section className="panel">
      <div className="hero">
        <h1>Manage Users</h1>
        <p>Create user accounts and assign roles for portal access.</p>
      </div>

      <div className="list" style={{ marginBottom: "0.8rem" }}>
        {users.length === 0 ? (
          <article className="card">
            <p className="muted" style={{ margin: 0 }}>No users found or unable to load users.</p>
          </article>
        ) : users.map((user) => (
          <article className="list-item" key={user.id}>
            <div>
              <h4 style={{ margin: 0 }}>{user.fullName}</h4>
              <p className="muted" style={{ margin: "0.3rem 0 0" }}>{user.email}</p>
            </div>
            <div className="chips">
              <span className="chip">{user.role}</span>
              <span className="chip">{user.accountStatus}</span>
            </div>
          </article>
        ))}
      </div>

      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="manage-name">Full Name</label>
          <input
            id="manage-name"
            className="input"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="manage-email">Email</label>
            <input
              id="manage-email"
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="manage-role">Role</label>
            <select
              id="manage-role"
              className="select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="manage-password">Password</label>
          <input
            id="manage-password"
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="btn btn-primary" type="submit">Create User</button>
        {msg ? <p className={msgClass}>{msg}</p> : null}
      </form>
    </section>
  );
}
