"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import { Package, Plus, Edit2, Trash2, CheckCircle2, X, Search, AlertTriangle } from "lucide-react";
import { RawMaterial } from "@/lib/types";

export default function MasterBahanBakuPage() {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial } = useAppStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMat, setEditingMat] = useState<RawMaterial | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unit, setUnit] = useState("kg");
  const [standardCost, setStandardCost] = useState(35000);
  const [minStockAlert, setMinStockAlert] = useState(20);

  const openAddModal = () => {
    setEditingMat(null);
    setName("");
    setCode("");
    setUnit("kg");
    setStandardCost(35000);
    setMinStockAlert(20);
    setIsModalOpen(true);
  };

  const openEditModal = (m: RawMaterial) => {
    setEditingMat(m);
    setName(m.name);
    setCode(m.code);
    setUnit(m.unit);
    setStandardCost(m.standardCost);
    setMinStockAlert(m.minStockAlert);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMat) {
      updateRawMaterial(editingMat.id, {
        name,
        code: code.toUpperCase(),
        unit,
        standardCost,
        minStockAlert,
      });
      setFeedback(`Bahan baku "${name}" berhasil diperbarui!`);
    } else {
      addRawMaterial({
        name,
        code: code.toUpperCase(),
        unit,
        standardCost,
        minStockAlert,
        isActive: true,
      });
      setFeedback(`Bahan baku baru "${name}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (m: RawMaterial) => {
    if (confirm(`Yakin ingin menghapus bahan baku "${m.name}"?`)) {
      deleteRawMaterial(m.id);
      setFeedback(`Bahan baku "${m.name}" berhasil dihapus.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = rawMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MASTER INVENTARIS PUSAT (CRUD)
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Master Data Bahan Baku (Bill of Materials)
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Daftar bahan baku resmi standar resep, harga pokok per unit, dan batas minimum stok peringatan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Bahan Baku Baru</span>
        </button>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{feedback}</p>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama bahan atau kode SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-zinc-800"
        />
      </div>

      {/* Raw Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                  {mat.code}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  AKTIF
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-1">{mat.name}</h3>
              <p className="text-base font-black text-[#D32323]">
                {formatRupiah(mat.standardCost)}{" "}
                <span className="text-xs font-normal text-zinc-500">/ {mat.unit}</span>
              </p>
              <p className="text-[11px] text-zinc-500 pt-1">
                Min. Stock Alert: <strong>{mat.minStockAlert} {mat.unit}</strong>
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-1.5">
              <button
                onClick={() => openEditModal(mat)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                title="Edit Bahan"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(mat)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                title="Hapus Bahan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH / EDIT BAHAN BAKU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">
                {editingMat ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nama Bahan Baku:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ayam Segar Karkas Potong 9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Kode Bahan (SKU):</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BB-AYAM-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 font-mono uppercase focus:outline-none focus:border-[#D32323]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Satuan Ukur (Unit):</label>
                  <input
                    type="text"
                    required
                    placeholder="kg / liter / pack / pcs"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Harga Standar per Unit (Rp):</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    required
                    value={standardCost}
                    onChange={(e) => setStandardCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Batas Minimum Alert:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
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
                  {editingMat ? "Simpan Perubahan" : "Tambah Bahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
