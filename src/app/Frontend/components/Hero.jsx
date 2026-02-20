"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "../../../lib/firebase"; // or "@/lib/firebase" if you have path aliases
import { onAuthStateChanged } from "firebase/auth";

const slides = [
  { src: "/images/slide-1.png", link: "/" },
  { src: "/images/slide-2.png", link: "/" },
  { src: "/images/slide-3.png", link: "/" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* CHECK LOGIN STATUS WITH FIREBASE */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleLiveMonitoring = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      alert("Please login to access Live Monitoring");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <section className="relative w-full min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen pt-20 overflow-hidden">
      {/* BACKGROUND */}
      <Image
        src="/images/hero-section-img-2.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover -z-10"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-12">

        {/* LEFT */}
        <div className="w-full md:w-1/2 text-white">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold bg-white text-[#2F4FA3] rounded-full">
            Trusted Digital Healthcare
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Smart Care Powered by
            <span className="text-[#9DB4FF]"> Apollo Health</span>
          </h1>

          <p className="mt-5 text-gray-200 text-base sm:text-lg">
            Continuous health monitoring with intelligent insights,
            secure data handling, and instant alerts.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            {/* GET STARTED (only shows when NOT logged in) */}
            {!isLoggedIn && (
              <button
                onClick={handleGetStarted}
                className="bg-[#2F4FA3] px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Get Started
              </button>
            )}

            {/* LIVE MONITORING (always shows with animation) */}
            <motion.button
              onClick={handleLiveMonitoring}
              whileHover={{ scale: 1.08 }}
              animate={{
                boxShadow: [
                  "0 0 0px #fff",
                  "0 0 15px #9DB4FF",
                  "0 0 0px #fff",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="border border-white px-8 py-3 rounded-full font-semibold backdrop-blur-md"
            >
              ♥ Live Monitoring
            </motion.button>

          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-xl h-105 overflow-hidden rounded-3xl shadow-2xl bg-black/10 backdrop-blur-md">

            <div
              className="flex h-full transition-transform duration-1000"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <Link key={index} href={slide.link} className="min-w-full h-full">
                  <Image
                    src={slide.src}
                    alt="Hero Slide"
                    width={600}
                    height={420}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>

            {/* ARROWS */}
            <button
              onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 w-10 h-10 rounded-full text-white"
            >
              ‹
            </button>

            <button
              onClick={() => setCurrent((current + 1) % slides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 w-10 h-10 rounded-full text-white"
            >
              ›
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
