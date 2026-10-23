"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import {
  Tag,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Promotion } from "@/lib/types";

export default function AdminPromoPage() {
  const { promotions } = useAppStore();
  const [promoList, setPromoList] = useState<Promotion[]>(promotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("20% OFF");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      bannerImage: "/images/hero/hero-banner-hd.jpg",
      startDate,
      endDate,
      code: code.toUpperCase(),
      discountValue,
      isActive: true,
    };
    setPromoList([newPromo, ...promoList]);
    setIsModalOpen(false);
    setTitle("");
    setCode("");
    setDescription("");
  };

  const toggleStatus = (id: string) => {
    setPromoList(
      promoList.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            MARKETING & CMS
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Manajemen Promo & Kupon Diskon</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Kelola promosi diskon, kupon kasir, dan penawaran khusus seluruh jaringan restoran D&apos;Besto.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Promo Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Total Promo Terdaftar</span>
          <p className="text-2xl font-black text-zinc-900">{promoList.length} Program</p>
          <p className="text-[11px] text-zinc-500 mt-1">Aktif & jadwal mendatang</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Promo Aktif Tayang</span>
          <p className="text-2xl font-black text-emerald-600">
            {promoList.filter((p) => p.isActive).length} Tayang di Web & POS
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Dapat diklaim pelanggan</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Rata-rata Diskon</span>
          <p className="text-2xl font-black text-[#D32323]">20% - 30%</p>
          <p className="text-[11px] text-zinc-500 mt-1">Insentif transaksi</p>
        </div>
      </div>

      {/* Promo Table / Cards */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h3 className="font-black text-base text-zinc-900">Daftar Banner Promo & Kode Kupon</h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {promoList.map((promo) => (
            <div key={promo.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50/80 transition">
              <div className="flex items-start gap-4">
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                  <Image
                    src={promo.bannerImage || "/images/hero/hero-banner-hd.jpg"}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-[#D32323] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    {promo.discountValue}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-900">{promo.title}</h4>
                    {promo.isActive ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    ) : (
                      <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Non-Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 max-w-xl">{promo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      KODE: {promo.code || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {promo.startDate} s/d {promo.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(promo.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    promo.isActive
                      ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {promo.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Buat Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">Buat Program Promo Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Judul Promo *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Gajian Hemat D'Besto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Kode Kupon Kasir/Web *</label>
                  <input
                    type="text"
                    required
                    placeholder="GAJIAN20"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Nilai Diskon Badge *</label>
                  <input
                    type="text"
                    required
                    placeholder="DISKON 20% / FREE TEH"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Deskripsi Syarat & Ketentuan</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan menu yang termasuk dalam paket promo ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 font-bold hover:bg-zinc-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D32323] hover:bg-[#B31818] text-white font-bold"
                >
                  Simpan & Terbitkan Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
