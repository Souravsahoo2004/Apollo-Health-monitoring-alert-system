"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/slide-1.png", link: "/services" },
  { src: "/images/slide-2.png", link: "/monitoring" },
  { src: "/images/slide-3.png", link: "/reports" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 8 seconds (slow & smooth)
useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[90vh] pt-20 overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/images/hero-section-img-2.jpg"
        alt="Hero Background"
        fill
        priority
        sizes="100vw"
        className="object-cover -z-10"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* LEFT CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="md:w-1/2 text-white">

          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold bg-white text-[#2F4FA3] rounded-full">
            Trusted Digital Healthcare
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Smart Care Powered by
            <span className="text-[#9DB4FF]"> Apolo Health</span>
          </h1>

          <p className="mt-5 text-gray-200 text-lg">
            Continuous health monitoring with intelligent insights,
            secure data handling, and instant alerts.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-[#2F4FA3] px-8 py-3 rounded-full font-semibold">
              Get Started
            </button>

            <button className="border border-white px-8 py-3 rounded-full font-semibold">
              ♥ Live Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 HERO SLIDER (BIG, CENTERED RIGHT) */}
<div className="absolute top-28 right-32 z-20 w-150 h-105 overflow-hidden rounded-3xl shadow-2xl bg-black/10 backdrop-blur-md">

        {/* SLIDES */}
        <div
  className="flex h-full transition-transform duration-1200 ease-in-out"
  style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <Link
              key={index}
              href={slide.link}
              className="min-w-full h-full"
            >
              <Image
                src={slide.src}
                alt="Hero Slide"
                width={600}
                height={420}
                className="w-full h-full object-cover cursor-pointer"
              />
            </Link>
          ))}
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        >
          ›
        </button>

        {/* DOT INDICATORS */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                current === index
                  ? "bg-white scale-110"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
