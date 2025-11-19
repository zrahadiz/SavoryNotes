import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import authLeftImg from "@/assets/authLeftImg.jpeg";
import Loading from "@/components/Loading";

export default function Login() {
  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [repeatShowPassword, setRepeatShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register attempt:", { name, email, password, repeatPassword });

    if (password !== repeatPassword) {
      toast("Password and Confirm password must be the same", {
        type: "error",
      });
      return;
    }
    setLoadingState(true);
    setLoadingText("Logging in...");
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "admin",
      });

      toast(data.payload.message || "Register Success", {
        type: "success",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error.response || "Failed to login");
      toast(error.response.data.payload.message || "Failed to login", {
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
            alt="Cooking background"
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
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: "#4CAF50" }}
              >
                🍳 SavoryNotes
              </h1>
              <p className="text-gray-600">Your AI culinary companion</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Let’s get cooking
                </h2>
                <p className="text-gray-600">
                  Sign up to continue your culinary journey
                </p>
              </div>

              <div className="space-y-5">
                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Miko Halim"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4CAF50",
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4CAF50",
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4CAF50",
                      }}
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

                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Confirm Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={repeatShowPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4CAF50",
                      }}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100 z-10 bg-base-100 cursor-pointer"
                      onClick={() => setRepeatShowPassword((prev) => !prev)}
                    >
                      {repeatShowPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn w-full text-white border-none text-base hover:shadow-lg transition-all duration-200"
                  style={{
                    backgroundColor: "#4CAF50",
                    "--hover-bg": "#45a049",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#45a049")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#4CAF50")
                  }
                >
                  Sign Up
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
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold hover:underline"
                    style={{ color: "#FF8F3A" }}
                  >
                    Sign in
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
