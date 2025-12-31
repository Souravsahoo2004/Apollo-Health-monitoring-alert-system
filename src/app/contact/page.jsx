"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Data:", formData);
    alert("Message sent successfully (demo)");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We’re here to support patients, families, and healthcare providers.
            Reach out for assistance, partnerships, or technical support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT: CONTACT INFO */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

            <h2 className="text-xl font-semibold text-[#2F4FA3] mb-6">
              Apollo Health Monitoring
            </h2>

            <ul className="space-y-4 text-gray-700">
              <li>
                <strong>📍 Address:</strong> Apollo Digital Health, India
              </li>
              <li>
                <strong>📞 Phone:</strong> +91 98765 43210
              </li>
              <li>
                <strong>📧 Email:</strong> support@apollohealth.com
              </li>
              <li>
                <strong>⏱ Support Hours:</strong> 24/7 Emergency Monitoring
              </li>
            </ul>

            {/* TRUST MESSAGE */}
            <div className="mt-8 p-4 rounded-xl bg-blue-50 text-blue-900">
              <p className="text-sm">
                🔒 Your data is secure. Apollo Health follows strict healthcare
                compliance and patient privacy standards.
              </p>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>

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
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg 
                  text-gray-800 placeholder-gray-400
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3]
                  outline-none"
                />
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
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg 
                  text-gray-800 placeholder-gray-400
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
                  placeholder="Optional"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg 
                  text-gray-800 placeholder-gray-400
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3]
                  outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg 
                  text-gray-800 placeholder-gray-400
                  focus:ring-2 focus:ring-[#2F4FA3] focus:border-[#2F4FA3]
                  outline-none resize-none"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-[#2F4FA3] text-white py-3 rounded-lg 
                font-medium hover:bg-[#243f8f] transition shadow"
              >
                Send Message
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
