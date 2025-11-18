import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomToaster from "./components/CustomToaster";
import Home from "./pages/Home";
import AppLayout from "./components/Layouts/AppLayout";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import RecipesPage from "./pages/Recipes";

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />

          <Route
            path="/recipes"
            element={
              <AppLayout>
                <RecipesPage />
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <CustomToaster />
    </>
  );
}

export default App;
