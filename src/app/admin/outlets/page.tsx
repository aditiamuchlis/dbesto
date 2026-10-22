"use client";

import { useState } from "react";
import { Store, Plus, MapPin, Phone, Clock, Target, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";

export default function AdminOutletsPage() {
  const { outlets, addOutlet } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState(-6.2);
  const [longitude, setLongitude] = useState(106.8);
  const [radiusMeters, setRadiusMeters] = useState(100);
  const [monthlyTarget, setMonthlyTarget] = useState(100000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    addOutlet({
      name,
      code: code.toUpperCase(),
      slug,
      city,
      address,
      phone,
      latitude,
      longitude,
      radiusMeters,
      openingTime: "09:00",
      closingTime: "22:00",
      monthlyTarget,
      isActive: true,
    });

    setIsModalOpen(false);
    setSuccessMsg(`Cabang baru "${name}" berhasil didaftarkan!`);
    setName("");
    setCode("");
    setAddress("");
    setCity("");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MASTER OUTLET CABANG
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Manajemen Jaringan Cabang D&apos;Besto</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Total {outlets.length} cabang aktif terdaftar dengan koordinat geofencing GPS
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md shadow-red-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Cabang Resto Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      )}

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 font-mono font-bold text-xs text-zinc-800">
                  {outlet.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                  AKTIF OPERASIONAL
                </span>
              </div>

              <h3 className="text-lg font-black text-zinc-900 leading-snug">{outlet.name}</h3>
              <p className="text-xs text-zinc-500 flex items-start gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>{outlet.address}, {outlet.city}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <p className="flex items-center justify-between">
                  <span className="text-zinc-400">Koordinat GPS:</span>
                  <span className="font-mono font-bold text-zinc-800">
                    {outlet.latitude.toFixed(4)}, {outlet.longitude.toFixed(4)}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-zinc-400">Radius Geofence:</span>
                  <span className="font-bold text-emerald-700">{outlet.radiusMeters} Meter</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-zinc-400">Target Omzet/Bln:</span>
                  <span className="font-black text-[#D32323]">{formatRupiah(outlet.monthlyTarget)}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>Jam: {outlet.openingTime} - {outlet.closingTime}</span>
              <span className="font-semibold">{outlet.phone || "-"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH OUTLET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-lg text-zinc-900">Pendaftaran Cabang Resto Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Nama Cabang Resto:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: D'Besto Tebet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Kode Cabang Unik:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TBT01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Kota:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Nomor Telepon Outlet:</label>
                  <input
                    type="text"
                    placeholder="0812-XXXX-XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Alamat Lengkap Cabang:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jl. Tebet Raya No. 12..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Latitude GPS:</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Longitude GPS:</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Radius (Meter):</label>
                  <input
                    type="number"
                    required
                    min={20}
                    max={500}
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Target Omzet Bulanan (Rp):</label>
                <input
                  type="number"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-black text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  Daftarkan Cabang Resto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
