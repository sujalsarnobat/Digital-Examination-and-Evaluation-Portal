import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

export function setBasicAuth(email, password) {
  const token = btoa(`${email}:${password}`);
  api.defaults.headers.common.Authorization = `Basic ${token}`;
}

export default api;
