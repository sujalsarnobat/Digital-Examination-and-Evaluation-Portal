import { Navigate } from "react-router-dom";
import {
  getAuthFromStorage,
  getDefaultRouteForRole,
  getRoleFromAuth
} from "../config/roleAccess";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const auth = getAuthFromStorage();
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const role = getRoleFromAuth(auth);
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}
