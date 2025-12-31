"use client";

export default function HospitalDrawer({ city, hoverCity, onClose }) {
  if (!city && !hoverCity) return null;

  const activeCity = hoverCity || city;

  return (
    <div className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-xl z-30 p-6">
      <button onClick={onClose} className="text-sm text-gray-500 mb-4">
        Close
      </button>

      <h2 className="text-xl font-bold text-blue-800">{activeCity.city}</h2>

      <ul className="mt-4 space-y-2">
        {activeCity.hospitals.map((h, i) => (
          <li key={i} className="text-gray-600">
            • {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
