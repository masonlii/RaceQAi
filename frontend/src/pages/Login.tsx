import { Navigate } from "react-router-dom";
import { AUTH_ENABLED } from "../config";

export default function Login() {
  if (!AUTH_ENABLED) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}
