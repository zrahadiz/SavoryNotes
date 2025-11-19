import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import authLeftImg from "@/assets/authLeftImg.jpeg";
import Loading from "@/components/Loading";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setLoadingText("Updating your password...");

    if (!password || !confirm) {
      toast("All fields are required", { type: "error" });
      setLoadingState(false);
      return;
    }

    if (password !== confirm) {
      toast("Passwords do not match", { type: "error" });
      setLoadingState(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      toast(data.payload.message, {
        type: "success",
      });

      if (data.payload.success) {
        navigate("/login");
      }
    } catch (error) {
      toast(
        error.response?.data?.payload?.message || "Failed to reset password",
        { type: "error" }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Loading status={loadingState} fullscreen text={loadingText} />

      {/* Left Side (Same as Forgot Password) */}
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
                Create a new password to continue your culinary journey
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
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">
                🍳 SavoryNotes
              </h1>
              <p className="text-gray-600">Create a new password</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">Enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      New Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="input input-bordered border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-control space-y-1">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Confirm Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="input input-bordered border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn w-full text-white border-none text-base bg-primary hover:bg-hprimary transition-all"
                >
                  Update Password
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Back to{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-secondary hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
