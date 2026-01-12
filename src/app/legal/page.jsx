"use client";

import { useState } from "react";

export default function LegalPage() {
  const [active, setActive] = useState("privacy");

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActive(id)}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition
        ${
          active === id
            ? "bg-blue-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Apollo Health Monitoring Alert System
        </h1>
        <p className="text-gray-600 mb-8">
          Privacy, Terms & Security Information
        </p>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <TabButton id="privacy" label="Privacy Policy" />
          <TabButton id="terms" label="Terms of Service" />
          <TabButton id="security" label="Security" />
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* Privacy Policy */}
          <section className={active === "privacy" ? "block" : "hidden"}>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Apollo Health Monitoring Alert System respects your privacy and is
              committed to protecting your personal and health-related data.
              This policy explains how we collect, use, and safeguard
              information.
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                We collect user data such as name, contact details, age, and
                health metrics only for monitoring and alert purposes.
              </li>
              <li>
                Health data is used strictly to provide alerts, reports, and
                better healthcare insights.
              </li>
              <li>
                We do not sell or share personal data with third parties without
                consent, except when required by law.
              </li>
              <li>
                Users can request data updates or deletion by contacting
                support.
              </li>
            </ul>
          </section>

          {/* Terms of Service */}
          <section className={active === "terms" ? "block" : "hidden"}>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Terms of Service
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using the Apollo Health Monitoring Alert System,
              you agree to the following terms and conditions.
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                This system is intended for health monitoring and alert support
                only, not as a replacement for professional medical advice.
              </li>
              <li>
                Users are responsible for providing accurate and updated
                information.
              </li>
              <li>
                Unauthorized use, data misuse, or system abuse is strictly
                prohibited.
              </li>
              <li>
                Apollo reserves the right to modify or discontinue services at
                any time.
              </li>
            </ul>
          </section>

          {/* Security */}
          <section className={active === "security" ? "block" : "hidden"}>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect user
              data and ensure system reliability.
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Secure authentication and role-based access control.</li>
              <li>Encrypted storage and transmission of sensitive data.</li>
              <li>Regular system audits and vulnerability checks.</li>
              <li>
                Restricted access to health records only for authorized
                personnel.
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-gray-500 border-t pt-6">
          © {new Date().getFullYear()} Apollo Health Monitoring Alert System. All
          rights reserved.
        </div>
      </div>
    </div>
  );
}
