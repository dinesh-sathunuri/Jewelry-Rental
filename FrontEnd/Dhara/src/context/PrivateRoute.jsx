import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { admin } = useAuth();

  if (!admin) {
    // Not logged in — redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected component
  return children;
}
