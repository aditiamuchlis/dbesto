"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  CheckCircle,
  ExternalLink,
  Navigation,
  ShieldCheck,
  ChevronRight,
  Store,
} from "lucide-react";
import { Outlet } from "@/lib/types";

export default function OutletsPage() {
  const router = useRouter();
  const { outlets, currentOutlet, switchOutlet } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const cities = Array.from(new Set(outlets.map((o) => o.city)));

  const filtered = outlets.filter((o) => {
    const matchCity = selectedCity === "all" || o.city.toLowerCase() === selectedCity.toLowerCase();
    const matchSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchSearch;
  });

  const handleSelectAndOrder = (outlet: Outlet) => {
    switchOutlet(outlet.id);
    router.push("/menu");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {}}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#181310] to-[#261D17] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-amber-400 font-semibold">Jaringan Outlet</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
                300+ CABANG DI SELURUH INDONESIA
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Temukan D&apos;Besto Terdekat
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-xl">
                Nikmati ayam krispi hangat favorit keluarga di cabang resmi terdekat dari rumah
                atau kantor Anda.
              </p>
            </div>

            {/* Quick search input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Cari cabang, kota, jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:bg-zinc-900 focus:border-[#FFC107] transition"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* City Filter Pills */}
      <section className="bg-white border-b border-zinc-200 py-3 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCity("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCity === "all"
                ? "bg-[#D32323] text-white shadow-xs"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            Semua Wilayah ({outlets.length})
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCity === city
                  ? "bg-[#D32323] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {city} ({outlets.filter((o) => o.city === city).length})
            </button>
          ))}
        </div>
      </section>

      {/* Main Outlet List */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Selected Active Outlet Highlight Card */}
        <div className="bg-amber-500/10 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">
                OUTLET AKTIF UNTUK PESANAN ANDA
              </span>
              <h3 className="text-xl font-black text-zinc-900">{currentOutlet.name}</h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                {currentOutlet.address} • Telp: {currentOutlet.phone}
              </p>
            </div>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition"
          >
            <span>Mulai Pesan Dari Outlet Ini</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((outlet) => {
            const isCurrent = outlet.id === currentOutlet.id;
            return (
              <div
                key={outlet.id}
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                  isCurrent
                    ? "border-amber-400 ring-2 ring-amber-300/40 shadow-lg"
                    : "border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D32323] bg-red-50 px-2 py-0.5 rounded-md">
                        {outlet.code}
                      </span>
                      <h3 className="font-extrabold text-lg text-zinc-900 mt-1.5 leading-snug">
                        {outlet.name}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-500">{outlet.city}</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Buka</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                    <span>{outlet.address}</span>
                  </p>

                  <div className="space-y-2 text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Jam Operasional: <strong>{outlet.openingTime} - {outlet.closingTime} WIB</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Telepon Outlet: <strong>{outlet.phone}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Geofence Radius: <strong>{outlet.radiusMeters} Meter</strong> ({outlet.latitude.toFixed(4)}, {outlet.longitude.toFixed(4)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleSelectAndOrder(outlet)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center transition cursor-pointer ${
                      isCurrent
                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    {isCurrent ? "✓ Outlet Terpilih" : "Pilih Outlet Ini"}
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${outlet.latitude},${outlet.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition"
                    title="Buka di Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
