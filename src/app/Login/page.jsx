"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    alert("Login successful (demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2F4FA3]">
            Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Apollo Health Monitoring System
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              name="id"
              required
              placeholder="Enter your ID"
              value={formData.id}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#2F4FA3] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#2F4FA3] text-white py-2 rounded-lg font-medium hover:bg-[#243f8f] transition shadow"
          >
            Login
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link href="/Register" className="text-[#2F4FA3] hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
