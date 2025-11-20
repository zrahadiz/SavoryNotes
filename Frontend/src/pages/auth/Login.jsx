import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import authLeftImg from "@/assets/authLeftImg.jpeg";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    setLoadingState(true);
    setLoadingText("Logging in...");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      console.log(data);

      if (data.payload.datas.accessToken) {
        localStorage.setItem("accessToken", data.payload.datas.accessToken);
      }
      if (data.payload.datas.refreshToken) {
        localStorage.setItem("refreshToken", data.payload.datas.refreshToken);
      }

      const { accessToken, refreshToken, ...userData } = data.payload.datas;
      setUser(userData);

      toast(data.payload.message || "Login Success", {
        type: "success",
      });
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error.response || "Failed to login");
      toast(error.response?.data?.payload?.message || "Failed to login", {
        type: "error",
      });
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Loading status={loadingState} fullscreen text={loadingText} />

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block relative"
        >
          <img
            src={authLeftImg}
            alt="Food background"
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-12 text-white text-center">
            <div className="max-w-md space-y-6 text-center">
              <div className="text-6xl mb-4">🍳</div>
              <h1 className="text-5xl font-bold mb-4">Savory Notes</h1>
              <p className="text-lg font-light leading-relaxed">
                Your AI-powered culinary companion for healthier, smarter
                cooking
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">
                🍳 SavoryNotes
              </h1>
              <p className="text-gray-600">Your AI culinary companion</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to continue your culinary journey
                </p>
              </div>

              <div className="space-y-6">
                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input input-bordered border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-control space-y-1">
                  <label className="label flex justify-between">
                    <span className="label-text font-medium text-gray-700">
                      Password
                    </span>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-secondary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input input-bordered border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100 z-10 bg-base-100 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn w-full text-white border-none text-base hover:shadow-lg transition-all duration-200 bg-primary hover:bg-hprimary"
                >
                  Sign In
                </button>

                <div className="divider text-gray-400 text-sm">OR</div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="btn btn-outline w-full text-gray-700 hover:bg-gray-100 transition"
                  >
                    Continue without login
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-secondary hover:underline"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
