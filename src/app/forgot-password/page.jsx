"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset link has been sent to your email."
      );
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2F4FA3]">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Apollo Health Monitoring System
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg
                text-gray-800 placeholder-gray-500
                focus:ring-2 focus:ring-[#2F4FA3]
                focus:border-[#2F4FA3] outline-none"
            />
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2F4FA3] text-white py-2 rounded-lg font-medium
              hover:bg-[#243f8f] transition shadow disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[#2F4FA3] hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
