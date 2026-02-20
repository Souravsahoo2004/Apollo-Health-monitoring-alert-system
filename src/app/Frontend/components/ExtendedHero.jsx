"use client";

import Image from "next/image";
import Link from "next/link";

const ExtendedHero = () => {
  return (
    <section className="relative w-full bg-[#F7F9FF] py-24">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold bg-[#2F4FA3]/10 text-[#2F4FA3] rounded-full">
            Touching Lives • Trusted by Apollo
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Real-Time Health Monitoring
            <br />
            <span className="text-[#2F4FA3]">
              That Keeps Families Connected
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Our intelligent health monitoring system continuously tracks patient
            vitals and instantly notifies family members and caregivers during
            critical situations. Built on Apollo’s trusted healthcare standards,
            we ensure care never stops — even when you’re not around.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-[#2F4FA3] text-xl">✔</span>
              <p className="text-gray-700">
                Continuous monitoring of heart rate, oxygen levels, and vital signs
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-[#2F4FA3] text-xl">✔</span>
              <p className="text-gray-700">
                Instant alerts sent to family members during emergencies
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-[#2F4FA3] text-xl">✔</span>
              <p className="text-gray-700">
                Secure medical data handling compliant with healthcare standards
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-[#2F4FA3] text-xl">✔</span>
              <p className="text-gray-700">
                Trusted technology inspired by Apollo’s patient-first approach
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex gap-4">
            <Link
              href="/contact"
              className="bg-[#2F4FA3] text-white px-8 py-4 rounded-full font-semibold shadow-md hover:bg-[#243f8f] transition"
            >
              Contact Us
            </Link>

            <Link
              href="/about"
              className="border border-[#2F4FA3] text-[#2F4FA3] px-8 py-4 rounded-full font-semibold hover:bg-[#2F4FA3]/5 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl bg-[#2F4FA3]/10"></div>

          <Image
            src="/images/extended-hero.jpg"
            alt="Health Monitoring System"
            width={520}
            height={420}
            className="relative rounded-3xl shadow-2xl object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default ExtendedHero;
