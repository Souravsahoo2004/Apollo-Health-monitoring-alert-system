"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Mukti Kumari",
    role: "Cardiac Patient",
    city: "New Delhi",
    image: "/images/user1.jpg",
    rating: 5,
    feedback:
      "The care I received at Apollo Hospitals was exceptional. The doctors explained every step clearly, and the facilities were world-class.",
  },
  {
    name: "Anita Sharma",
    role: "Oncology Patient",
    city: "Chennai",
    image: "/images/user2.jpg",
    rating: 5,
    feedback:
      "Apollo gave me hope during the most difficult phase of my life. The medical team treated me with compassion and professionalism.",
  },
  {
    name: "Michael Thompson",
    role: "International Patient",
    city: "UK",
    image: "/images/user3.jpg",
    rating: 4,
    feedback:
      "From visa assistance to post-treatment care, Apollo Hospitals managed everything seamlessly. Truly a global healthcare leader.",
  },
  {
    name: "Suresh Patil",
    role: "Orthopedic Surgery",
    city: "Bangalore",
    image: "/images/user4.jpg",
    rating: 4,
    feedback:
      "The advanced technology and expert doctors at Apollo helped me recover faster than expected. Highly recommended.",
  },
  {
    name: "Priya Das",
    role: "Preventive Health Program",
    city: "Kolkata",
    image: "/images/user5.jpg",
    rating: 3,
    feedback:
      "Apollo Clinics made preventive healthcare easy and accessible. Regular check-ups are now stress-free.",
  },
];

export default function ApolloTestimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-14">
          What Our Patients Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-blue-800">{t.role}</p>
                </div>
              </div>

              {/* STARS */}
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* FEEDBACK */}
              <p className="text-gray-600 leading-relaxed mb-6">
                “{t.feedback}”
              </p>

              {/* CITY */}
              <p className="text-sm text-gray-500 mt-auto">{t.city}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
