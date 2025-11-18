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
import RecipesList from "@/pages/Recipes/RecipesList";
import AddRecipes from "@/pages/Recipes/AddRecipes";
import EditRecipePage from "./pages/Recipes/EditRecipes";

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
                <RecipesList />
              </AppLayout>
            }
          />

          <Route
            path="/add-recipes"
            element={
              <AppLayout>
                <AddRecipes />
              </AppLayout>
            }
          />

          <Route
            path="/recipes/edit/:slug"
            element={
              <AppLayout>
                <EditRecipePage />
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
      <CustomToaster />
    </>
  );
}

export default App;
