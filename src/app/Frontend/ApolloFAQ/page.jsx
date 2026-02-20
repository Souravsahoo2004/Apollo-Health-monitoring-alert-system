"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Apollo Hospitals known for?",
    a: "Apollo Hospitals is India’s largest integrated healthcare group, known for clinical excellence and advanced medical technology.",
  },
  {
    q: "How many hospitals does Apollo operate?",
    a: "Apollo operates over 70 hospitals supported by 300+ clinics across India and globally.",
  },
  {
    q: "What is the difference between Apollo Hospitals and Clinics?",
    a: "Hospitals provide tertiary care while Clinics focus on outpatient and preventive healthcare services.",
  },
  {
    q: "Does Apollo offer emergency services?",
    a: "Yes, Apollo Hospitals provide 24/7 emergency and trauma care facilities.",
  },
  {
    q: "What specialties are available at Apollo?",
    a: "Apollo offers over 70 specialties including cardiology, oncology, neurology, and transplants.",
  },
  {
    q: "Does Apollo support cashless insurance?",
    a: "Yes, Apollo supports cashless insurance with most major providers.",
  },
  {
    q: "What digital healthcare services does Apollo offer?",
    a: "Apollo 24|7 offers online consultations, medicine delivery, lab tests, and digital health records.",
  },
  {
    q: "Is Apollo involved in medical research?",
    a: "Apollo invests heavily in AI diagnostics, robotic surgery, and clinical research.",
  },
  {
    q: "How does Apollo ensure patient safety?",
    a: "Apollo follows NABH & JCI standards with strict quality and safety protocols.",
  },
  {
    q: "Does Apollo treat international patients?",
    a: "Yes, Apollo is a global leader in medical tourism with dedicated international patient services.",
  },
];

export default function ApolloFAQ() {
  const BASE_COUNT = 5;

  const [openIndexes, setOpenIndexes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BASE_COUNT);

  const toggleFAQ = (index) => {
    const isOpen = openIndexes.includes(index);

    if (isOpen) {
      // CLOSE FAQ
      const updatedOpen = openIndexes.filter((i) => i !== index);
      setOpenIndexes(updatedOpen);

      const reducedCount = BASE_COUNT + updatedOpen.length * 2;
      setVisibleCount(Math.max(BASE_COUNT, reducedCount));
    } else {
      // OPEN FAQ
      const updatedOpen = [...openIndexes, index];
      setOpenIndexes(updatedOpen);

      const increase =
        updatedOpen.length === 1 ? 2 : 3;

      setVisibleCount((prev) =>
        Math.min(faqs.length, prev + increase)
      );
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.slice(0, visibleCount).map((item, index) => {
            const isOpen = openIndexes.includes(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {item.q}
                  </span>
                  <span
  className={`
    flex items-center justify-center
    w-8 h-8 rounded-full
    bg-blue-900 text-white
    font-bold text-xl
    transition-all duration-300
    ${isOpen ? "rotate-180 scale-105" : "scale-100"}
  `}
>
  {isOpen ? "−" : "+"}
</span>

                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-600 leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
