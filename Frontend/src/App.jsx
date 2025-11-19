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
import RecipeDetail from "./pages/Recipes/RecipeDetail";
import About from "./pages/About";
import ApproveUser from "./pages/ApproveUser";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  const { checkAuth, fetchUser } = useAuthStore();

  useEffect(() => {
    async function init() {
      const loggedIn = await checkAuth();
      if (loggedIn) {
        await fetchUser();
      }
    }
    init();
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />

          <Route
            path="/approve-user"
            element={
              <AppLayout>
                <ApproveUser />
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
            path="/about"
            element={
              <AppLayout>
                <About />
              </AppLayout>
            }
          />

          <Route
            path="/recipe/:slug"
            element={
              <AppLayout>
                <RecipeDetail />
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
