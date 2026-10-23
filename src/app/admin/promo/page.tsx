"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import {
  Tag,
  Plus,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Search,
} from "lucide-react";
import { Promotion } from "@/lib/types";

export default function AdminPromoPage() {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useAppStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("20% OFF");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [description, setDescription] = useState("");

  const openAddModal = () => {
    setEditingPromo(null);
    setTitle("");
    setCode("");
    setDiscountValue("HEMAT 20%");
    setStartDate("2026-10-01");
    setEndDate("2026-12-31");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p);
    setTitle(p.title);
    setCode(p.code || "");
    setDiscountValue(p.discountValue || "");
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setDescription(p.description);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingPromo) {
      updatePromotion(editingPromo.id, {
        title,
        slug,
        code: code.toUpperCase(),
        discountValue,
        startDate,
        endDate,
        description,
      });
      setFeedback(`Promo "${title}" berhasil diperbarui!`);
    } else {
      addPromotion({
        title,
        slug,
        code: code.toUpperCase(),
        discountValue,
        startDate,
        endDate,
        description,
        bannerImage: "/images/hero/hero-banner-hd.jpg",
        isActive: true,
      });
      setFeedback(`Promo baru "${title}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (p: Promotion) => {
    if (confirm(`Yakin ingin menghapus promo "${p.title}"?`)) {
      deletePromotion(p.id);
      setFeedback(`Promo "${p.title}" berhasil dihapus.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const toggleStatus = (p: Promotion) => {
    updatePromotion(p.id, { isActive: !p.isActive });
    setFeedback(`Status promo "${p.title}" diubah.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = promotions.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ? p.code.toLowerCase().includes(search.toLowerCase()) : false)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MANAJEMEN PROMO & KUPON (CRUD)
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Program Diskon & Voucher</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Atur kupon voucher kasir dan banner promosi yang tampil di website pelanggan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Buat Program Promo Baru</span>
        </button>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{feedback}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari promo berdasarkan judul atau kode kupon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-zinc-800"
        />
      </div>

      {/* Promo List */}
      <div className="space-y-4">
        {filtered.map((promo) => (
          <div
            key={promo.id}
            className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                <Image
                  src={promo.bannerImage || "/images/hero/hero-banner-hd.jpg"}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-[#D32323]">
                    {promo.discountValue}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      promo.isActive ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {promo.isActive ? "Aktif Berjalan" : "Nonaktif"}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{promo.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-1">{promo.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1 font-mono">
                  <span className="font-bold text-[#D32323] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    KODE: {promo.code}
                  </span>
                  <span>
                    {promo.startDate} s/d {promo.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => toggleStatus(promo)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  promo.isActive
                    ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                    : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {promo.isActive ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                onClick={() => openEditModal(promo)}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                title="Edit Promo"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(promo)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                title="Hapus Promo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">
                {editingPromo ? "Edit Program Promo" : "Buat Program Promo Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Judul Promo *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Gajian Hemat D'Besto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
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
                    className="w-full p-2.5 rounded-xl border border-zinc-300 uppercase font-mono focus:outline-none focus:border-[#D32323]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Nilai Diskon Badge *</label>
                  <input
                    type="text"
                    required
                    placeholder="DISKON 20% / HEMAT 15%"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
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
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Keterangan / Syarat Ketentuan</label>
                <textarea
                  rows={3}
                  placeholder="Berlaku untuk pemesanan dine-in & takeaway di semua resto D'Besto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D32323] hover:bg-[#B31818] text-white font-bold shadow-md cursor-pointer"
                >
                  {editingPromo ? "Simpan Perubahan" : "Terbitkan Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
