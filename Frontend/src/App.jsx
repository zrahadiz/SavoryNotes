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
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
  }, [checkAuth, fetchUser]);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />

          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
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
            path="/recipes"
            element={
              <AppLayout>
                <RecipesList />
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
            path="/add-recipes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddRecipes />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipes/edit/:slug"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EditRecipePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/approve-user"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ApproveUser />
                </AppLayout>
              </ProtectedRoute>
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
