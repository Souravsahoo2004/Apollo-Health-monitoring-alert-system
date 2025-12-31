"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    email: "",
    id: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [storedOtpData, setStoredOtpData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    if (!formData.email) {
      alert("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        // Store OTP data temporarily (in production, use session/database)
        setStoredOtpData({
          otp: data.otp,
          expiry: data.expiry,
        });
        alert("OTP sent to your email! Check your inbox.");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please verify your email first");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Verify OTP
      const verifyResponse = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
          storedOtp: storedOtpData.otp,
          expiry: storedOtpData.expiry,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.verified) {
        alert(verifyData.message || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      // 2️⃣ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 3️⃣ Store extra user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        email: formData.email,
        idNumber: formData.id,
        role: "Doctor",
        emailVerified: true, // Mark as verified since OTP was confirmed
        createdAt: new Date(),
      });

      alert("Registration successful! You can now login.");
      router.push("/login");

    } catch (error) {
      console.error(error);
      alert(error.message);
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
              outline-none"
            />
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
              outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Email with OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
                className="mt-1 flex-1 px-4 py-2 border rounded-lg 
                text-gray-800 placeholder-gray-500 
                focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
                outline-none disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || otpSent}
                className="mt-1 px-4 py-2 bg-[#2F4FA3] text-white rounded-lg 
                hover:bg-[#243f8f] transition disabled:opacity-50"
              >
                {otpSent ? "Sent ✓" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Input (shown after OTP is sent) */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                required
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="mt-1 w-full px-4 py-2 border rounded-lg 
                text-gray-800 placeholder-gray-500 
                focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] 
                outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the verification code
              </p>
            </div>
          )}

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
              outline-none"
            />
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
              outline-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || !otpSent}
            className="w-full bg-[#2F4FA3] text-white py-2 rounded-lg font-medium 
            hover:bg-[#243f8f] transition shadow disabled:opacity-50"
          >
            {loading ? "Processing..." : "Register"}
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
