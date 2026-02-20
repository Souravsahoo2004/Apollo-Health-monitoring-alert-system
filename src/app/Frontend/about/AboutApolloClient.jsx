"use client";

import { useState } from "react";
import AboutApolloMap from "./AboutApolloMap";
import HospitalDrawer from "./HospitalDrawer";
import SuccessCounters from "./SuccessCounters";
import ApolloTimeline from "./ApolloTimeline";
import { apolloLocationsIndia } from "@/data/apolloLocationsIndia";
import { apolloLocationsWorld } from "@/data/apolloLocationsWorld";

export default function AboutApolloClient() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [hoverCity, setHoverCity] = useState(null);
  const [mapType, setMapType] = useState("india");

  const locations =
    mapType === "india" ? apolloLocationsIndia : apolloLocationsWorld;

  return (
    <div className="w-full ">
      {/* ================= MAP SECTION ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto relative px-4">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
            Our Branches
          </h2>

          {/* Toggle */}
          <div className="flex justify-end mb-3 gap-2">
            <button
              onClick={() => setMapType("india")}
              className={`px-4 py-2 rounded text-sm ${
                mapType === "india"
                  ? "bg-blue-700 text-white"
                  : "bg-white shadow"
              }`}
            >
              India
            </button>
            <button
              onClick={() => setMapType("world")}
              className={`px-4 py-2 rounded text-sm ${
                mapType === "world"
                  ? "bg-blue-700 text-white"
                  : "bg-white shadow"
              }`}
            >
              World
            </button>
          </div>

          {/* Map Card */}
          <div className="relative h-65 md:h-80 rounded-xl overflow-hidden shadow-lg bg-white">
            <AboutApolloMap
              locations={locations}
              onCityClick={setSelectedCity}
              onCityHover={setHoverCity}
              center={mapType === "india" ? [20.59, 78.96] : [20, 0]}
              zoom={mapType === "india" ? 5 : 2}
            />
          </div>

          {/* Drawer */}
          <HospitalDrawer
            city={selectedCity}
            hoverCity={hoverCity}
            onClose={() => setSelectedCity(null)}
          />
        </div>
      </section>

      <SuccessCounters />
      <ApolloTimeline />
    </div>
  );
}
