"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
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
  const {
    products,
    rawMaterials,
    posOrders,
    stockOpnames,
    purchaseOrders,
    attendances,
    promotions,
    articles,
    clearAllDummyData,
    seedOfficialMenu,
    seedOfficialMaterials,
  } = useAppStore();

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

      {/* Manajemen Status Data & Reset Bersih */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            MANAJEMEN DATABASE & CLEAN SLATE
          </span>
          <h3 className="text-lg font-black text-zinc-900 mt-1">
            Status Data Operasional & Pembersihan Total
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Monitor jumlah data aktif di sistem saat ini dan bersihkan semua data operasional jika diperlukan.
          </p>
        </div>

        {/* Real-time Data Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Katalog Menu:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{products.length} <span className="text-xs font-normal text-zinc-400">item</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Bahan Baku (BOM):</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{rawMaterials.length} <span className="text-xs font-normal text-zinc-400">item</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Order Kasir POS:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{posOrders.length} <span className="text-xs font-normal text-zinc-400">transaksi</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Purchase Orders:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{purchaseOrders.length} <span className="text-xs font-normal text-zinc-400">pengajuan</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Stock Opname:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{stockOpnames.length} <span className="text-xs font-normal text-zinc-400">laporan</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Absensi Staf:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{attendances.length} <span className="text-xs font-normal text-zinc-400">record</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Promosi Aktif:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{promotions.length} <span className="text-xs font-normal text-zinc-400">promo</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 block">Artikel Berita:</span>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{articles.length} <span className="text-xs font-normal text-zinc-400">artikel</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                seedOfficialMenu();
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Muat Menu Resmi D&apos;Besto
            </button>
            <button
              type="button"
              onClick={() => {
                seedOfficialMaterials();
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Muat Bahan Baku Resmi
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin MENGHAPUS SEMUA DATA OPERASIONAL (produk, transaksi POS, PO, stok opname, absensi)? Tindakan ini akan mengosongkan data secara permanen.")) {
                clearAllDummyData();
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }
            }}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-[#D32323] border border-red-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Bersihkan Semua Data (0 Data)
          </button>
        </div>
      </div>
    </div>
  );
}
