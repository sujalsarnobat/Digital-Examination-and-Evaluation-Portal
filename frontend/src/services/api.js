import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

const BASIC_AUTH_STORAGE_KEY = "basicAuthToken";

export function setBasicAuth(email, password) {
  const token = btoa(`${email}:${password}`);
  api.defaults.headers.common.Authorization = `Basic ${token}`;
  localStorage.setItem(BASIC_AUTH_STORAGE_KEY, token);
}

export function clearBasicAuth() {
  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem(BASIC_AUTH_STORAGE_KEY);
}

export function initializeBasicAuthFromStorage() {
  const token = localStorage.getItem(BASIC_AUTH_STORAGE_KEY);
  if (token) {
    api.defaults.headers.common.Authorization = `Basic ${token}`;
  }
}

initializeBasicAuthFromStorage();

export default api;
