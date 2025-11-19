import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import authLeftImg from "@/assets/authLeftImg.jpeg";
import Loading from "@/components/Loading";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast("Email is required", { type: "error" });
      return;
    }

    try {
      setLoadingState(true);
      setLoadingText("Sending reset link...");

      const { data } = await api.post("/auth/forgot-password", { email });

      toast(data.payload.message, {
        type: "success",
      });

      setEmail("");
      if (data.payload.success) {
        navigate("/login");
      }
    } catch (error) {
      toast(error.response?.data?.payload?.message || "Failed to send email", {
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
                Reset your password and continue your culinary journey
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
              <p className="text-gray-600">Reset your password</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Forgot Password
                </h2>
                <p className="text-gray-600">
                  Enter your email and we will send you a password reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  className="btn w-full text-white border-none text-base bg-primary hover:bg-hprimary transition-all"
                >
                  Send Reset Link
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-secondary hover:underline"
                  >
                    Back to login
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
