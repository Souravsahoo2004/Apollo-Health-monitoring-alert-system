"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    email: "",
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
    console.log("Registered Data:", formData);
    alert("Registration successful (demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2F4FA3]">
            Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Apollo Health Monitoring System
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            />
          </div>

          {/* Phone */}
         <div>
  <label className="block text-sm font-medium text-gray-700">
    Phone Number
  </label>
  <input
    type="tel"
    name="phone"
    required
    placeholder="Enter phone number"
    value={formData.phone}
    onChange={handleChange}
    className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"
  />
</div>


          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            />
          </div>

          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              name="id"
              required
              placeholder="Enter ID number"
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
 className="mt-1 w-full px-4 py-2 border rounded-lg 
    text-gray-800 placeholder-gray-500 
    focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
    outline-none"            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#2F4FA3] text-white py-2 rounded-lg font-medium hover:bg-[#243f8f] transition shadow"
          >
            Register
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered?{" "}
          <a href="/login" className="text-[#2F4FA3] hover:underline">
            Login here
          </a>
        </p>

      </div>
    </div>
  );
}
