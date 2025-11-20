import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function GuestRoute({ children }) {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
