"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔥 CHECK FIREBASE AUTH STATE (PRIMARY) + CLEAN LOCALSTORAGE ON LOGOUT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ USER LOGGED IN
        setUserEmail(user.email);
        setUserName(user.displayName || user.email?.split('@')[0]);
        setIsLoggedIn(true);
        setAuthLoading(false);
        
        // Update localStorage only if Firebase says user is logged in
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || user.email?.split('@')[0]);
        localStorage.setItem('userUid', user.uid);
      } else {
        // ❌ USER LOGGED OUT - CLEAR EVERYTHING
        setUserEmail("");
        setUserName("");
        setIsLoggedIn(false);
        setAuthLoading(false);
        
        // 🔥 CLEAR LOCALSTORAGE ON LOGOUT
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUid');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn || !userEmail) {
      alert("Please log in to send a message");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: userEmail,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: userName, phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADING SCREEN
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4FA3] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking login status...</p>
        </div>
      </div>
    );
  }

  // 🔥 NOT LOGGED IN - SHOW LOGIN SCREEN
  if (!isLoggedIn || !userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login to Contact Us
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            You need to be logged in to send messages to our support team.
          </p>
          
          <Link 
            href="/login" 
            className="inline-block bg-[#2F4FA3] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#243f8f] transition shadow-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // 🔥 LOGGED IN - SHOW CONTACT FORM
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* SUCCESS/ERROR MESSAGES */}
        {status === "success" && (
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="text-green-800 text-sm">✅ Message sent successfully!</p>
          </div>
        )}
        {status === "error" && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-red-800 text-sm">❌ Failed to send message. Please try again.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* CONTACT INFO */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-[#2F4FA3] mb-6">Apollo Health Monitoring</h2>
            <ul className="space-y-4 text-gray-700">
              <li><strong>📍 Address:</strong> Apollo Digital Health, India</li>
              <li><strong>📞 Phone:</strong> +91 98765 43210</li>
              <li><strong>📧 Email:</strong> support@apollohealth.com</li>
              <li><strong>⏱ Support Hours:</strong> 24/7 Emergency Monitoring</li>
            </ul>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Send Us a Message</h2>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">✅ Logged in as:</p>
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name || userName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2F4FA3] text-white py-3 rounded-lg font-semibold 
                hover:bg-[#243f8f] transition-all duration-200 shadow-lg 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
