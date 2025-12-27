"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-white border-t border-gray-200">

      {/* SUBTLE GLOW LINE */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-[#2F4FA3]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-extrabold text-[#2F4FA3]">
              Apolo Health
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Touching lives through intelligent health monitoring.
              Ensuring patient safety, family awareness, and trusted
              healthcare technology — inspired by Apollo standards.
            </p>
          </div>

          {/* SOLUTIONS */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Solutions
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/monitoring" className="hover:text-[#2F4FA3] transition">
                  Real-Time Monitoring
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-[#2F4FA3] transition">
                  Family Alert System
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#2F4FA3] transition">
                  Health Analytics
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[#2F4FA3] transition">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/about" className="hover:text-[#2F4FA3] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#2F4FA3] transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-[#2F4FA3] transition">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2F4FA3] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPLIANCE */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Compliance
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li>HIPAA Compliant</li>
              <li>ISO 27001 Certified</li>
              <li>GDPR Ready</li>
              <li>24/7 System Reliability</li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
<div className="my-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-sm">

          <p>
            © {new Date().getFullYear()} Apolo Health. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2F4FA3] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#2F4FA3] transition">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-[#2F4FA3] transition">
              Security
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
