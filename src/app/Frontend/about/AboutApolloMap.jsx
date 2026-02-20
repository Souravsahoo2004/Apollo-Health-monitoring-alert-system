"use client";

import { useEffect, useState, useRef } from "react";

export default function AboutApolloMap({
  locations,
  onCityClick,
  onCityHover,
  center,
  zoom,
}) {
  const [MapComponents, setMapComponents] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([RL, L]) => {
        // Fix default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        setMapComponents({
          MapContainer: RL.MapContainer,
          TileLayer: RL.TileLayer,
          Marker: RL.Marker,
          useMap: RL.useMap,
          Popup: RL.Popup,
        });
      }
    );
  }, []);

  if (!MapComponents)
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading map…
      </div>
    );

  const { MapContainer, TileLayer, Marker } = MapComponents;

  const handleZoom = (type) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const current = map.getZoom();
    map.setZoom(type === "in" ? current + 1 : current - 1);
  };

  return (
    <div className="relative h-full w-full z-0">
      {/* Zoom buttons */}
      <div className="absolute top-2 right-2 z-[400] flex flex-col gap-2">
        <button
          onClick={() => handleZoom("in")}
          className="bg-white p-1 rounded shadow font-bold hover:bg-gray-100 transition"
        >
          +
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="bg-white p-1 rounded shadow font-bold hover:bg-gray-100 transition"
        >
          -
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full z-0"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          setTimeout(() => mapInstance.invalidateSize(), 200);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {locations.map((loc, i) => (
          <Marker
            key={i}
            position={[loc.lat, loc.lng]}
            eventHandlers={{
              click: () => onCityClick(loc),
              mouseover: () => onCityHover(loc),
              mouseout: () => onCityHover(null),
            }}
          >
            {/* Hospital count badge */}
            <div className="absolute -mt-8 -ml-4 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
              {loc.hospitals.length}
            </div>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
