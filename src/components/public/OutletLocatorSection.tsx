"use client";

import { useState } from "react";
import { MapPin, Navigation, Phone, Clock, Compass } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateHaversineDistance } from "@/lib/geofence";

interface OutletLocatorProps {
  onSelectOutlet?: () => void;
}

export function OutletLocatorSection({ onSelectOutlet }: OutletLocatorProps) {
  const { outlets, currentOutlet, switchOutlet } = useAppStore();
  const [searchCity, setSearchCity] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        // Fallback simulation: near Margonda
        setUserLocation({ lat: -6.369, lon: 106.834 });
        setGeoLoading(false);
      }
    );
  };

  const filteredOutlets = outlets
    .filter(
      (o) =>
        o.name.toLowerCase().includes(searchCity.toLowerCase()) ||
        o.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        o.address.toLowerCase().includes(searchCity.toLowerCase())
    )
    .map((o) => {
      let distanceM: number | null = null;
      if (userLocation) {
        distanceM = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lon,
          o.latitude,
          o.longitude
        );
      }
      return { ...o, distanceM };
    })
    .sort((a, b) => {
      if (a.distanceM !== null && b.distanceM !== null) {
        return a.distanceM - b.distanceM;
      }
      return 0;
    });

  return (
    <section id="outlet" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#D32323] block mb-1">
              JARINGAN RESTO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Temukan Outlet Terdekat
            </h2>
            <p className="mt-2 text-sm text-zinc-600 max-w-xl">
              D&apos;Besto hadir lebih dekat denganmu. Kunjungi langsung atau pilih outlet terdekat untuk
              pesanan takeaway dan delivery cepat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Cari kota / cabang..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="px-4 py-2 text-xs sm:text-sm rounded-full border border-zinc-200 focus:outline-none focus:border-[#D32323]"
            />
            <button
              onClick={handleGetLocation}
              disabled={geoLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <Compass className={`w-4 h-4 ${geoLoading ? "animate-spin" : ""}`} />
              <span>{userLocation ? "Lokasi Terdeteksi" : "Cari Terdekat Saya"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredOutlets.map((outlet) => {
            const isSelected = currentOutlet.id === outlet.id;
            return (
              <div
                key={outlet.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#D32323] bg-red-50/20 shadow-md ring-2 ring-red-500/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-zinc-100 text-zinc-700 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                      {outlet.code}
                    </span>
                    {outlet.distanceM !== null && (
                      <span className="text-xs font-extrabold text-[#D32323] bg-red-50 px-2.5 py-0.5 rounded-full">
                        {(outlet.distanceM / 1000).toFixed(1)} km dari Anda
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 leading-snug">{outlet.name}</h3>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                    <span>{outlet.address}, {outlet.city}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-500">
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Jam Buka: {outlet.openingTime} - {outlet.closingTime} WIB</span>
                    </p>
                    {outlet.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{outlet.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      switchOutlet(outlet.id);
                      if (onSelectOutlet) onSelectOutlet();
                    }}
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                      isSelected
                        ? "bg-[#D32323] text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                    }`}
                  >
                    {isSelected ? "Cabang Terpilih" : "Pilih Cabang Ini"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
