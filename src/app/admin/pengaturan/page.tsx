"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminPengaturanPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    brandName: "D'Besto Chicken & Burger",
    tagline: "Raja Crispy - Kualitas Halal, Rasa Spesial, Harga Sahabat",
    hqAddress: "Gedung D'Besto Central Tower Lt. 5, Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan",
    customerCarePhone: "0811-9988-771",
    customerCareEmail: "halo@dbesto.co.id",
    instagram: "@dbesto_official",
    tiktok: "@dbestoid",
    taxRate: 10,
    defaultGeofenceMeters: 100,
    lateToleranceMinutes: 15,
    autoPrintReceipt: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            KONFIGURASI PUSAT
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Pengaturan Identitas & Kebijakan Operasional</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Konfigurasi informasi brand resmi, kontak layanan, parameter pajak PB1, dan geofencing absensi.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Brand */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D32323]" />
            <span>Identitas Website & Brand</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Nama Brand / Perusahaan</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Slogan / Tagline Resmi</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-zinc-700">Alamat Lengkap Kantor Pusat (HQ)</label>
            <textarea
              rows={2}
              value={settings.hqAddress}
              onChange={(e) => setSettings({ ...settings, hqAddress: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-zinc-200"
            />
          </div>
        </div>

        {/* Layanan & Media Sosial */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Customer Service & Media Sosial</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">No. WhatsApp Customer Care</label>
              <input
                type="text"
                value={settings.customerCarePhone}
                onChange={(e) => setSettings({ ...settings, customerCarePhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Email Customer Service</label>
              <input
                type="email"
                value={settings.customerCareEmail}
                onChange={(e) => setSettings({ ...settings, customerCareEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Akun Instagram Resmi</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Akun TikTok Resmi</label>
              <input
                type="text"
                value={settings.tiktok}
                onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Kebijakan Resto & Keuangan */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Kebijakan Operasional Resto & Finansial</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Tarif Pajak Resto (PB1 %)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
              <span className="text-[10px] text-zinc-400">Default 10% dihitung saat transaksi POS</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Default Radius Geofence (Meter)</label>
              <input
                type="number"
                value={settings.defaultGeofenceMeters}
                onChange={(e) => setSettings({ ...settings, defaultGeofenceMeters: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
              <span className="text-[10px] text-zinc-400">Jarak toleransi clock-in staf dari titik resto</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Batas Toleransi Terlambat (Menit)</label>
              <input
                type="number"
                value={settings.lateToleranceMinutes}
                onChange={(e) => setSettings({ ...settings, lateToleranceMinutes: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-zinc-200"
              />
              <span className="text-[10px] text-zinc-400">Di atas ini tercatat berstatus TERLAMBAT</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg shadow-red-500/25 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
