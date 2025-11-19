import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function GuestRoute({ children }) {
  const { user } = useAuthStore();
  console.log(user);
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
