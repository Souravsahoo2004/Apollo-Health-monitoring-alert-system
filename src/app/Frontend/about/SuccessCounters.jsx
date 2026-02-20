"use client";

import { motion } from "framer-motion";

export default function SuccessCounters() {
  const stats = [
    { value: "97%", label: "Surgery Success Rate" },
    { value: "150M+", label: "Patients Served" },
    { value: "40+", label: "Years of Trust" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl shadow"
          >
            <h3 className="text-4xl font-bold text-blue-700">
              {s.value}
            </h3>
            <p className="mt-2 text-gray-600">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
