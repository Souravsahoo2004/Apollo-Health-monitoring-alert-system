"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const history = [
  {
    year: "1983",
    title: "Foundation of Apollo Hospitals",
    desc: "Apollo Hospitals was founded by Dr. Prathap C. Reddy, marking the beginning of India’s first corporate healthcare network with world-class standards.",
    img: "/images/1983.jpg",
  },
  {
    year: "1996",
    title: "Pioneering Telemedicine in India",
    desc: "Apollo launched India’s first telemedicine centre, connecting rural and remote regions with expert healthcare through technology.",
    img: "/images/1996.jpg",
  },
  {
    year: "2010",
    title: "Global Expansion",
    desc: "Apollo expanded internationally, setting benchmarks in medical tourism and bringing Indian healthcare expertise to the world.",
    img: "/images/2010.jpg",
  },
  {
    year: "2023",
    title: "150+ Million Lives Touched",
    desc: "With decades of trust, Apollo Hospitals crossed the milestone of serving over 150 million patients globally.",
    img: "/images/2023.jpg",
  },
];

export default function ApolloHistory() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-16">
          Apollo History
        </h2>

        <div className="space-y-20">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="w-full md:w-1/2">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-lg object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="w-full md:w-1/2">
                <span className="text-blue-700 font-semibold text-lg">
                  {item.year}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
