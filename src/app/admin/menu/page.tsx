"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Product } from "@/lib/types";

export default function AdminMenuPage() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    seedOfficialMenu,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "cat-ayam",
    price: 15000,
    image: "/images/menu/fried-chicken.jpg",
    description: "",
    badge: "",
    calories: "280 kkal",
    pieces: "1 Potong",
    isAvailable: true,
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryId: "cat-ayam",
      price: 15000,
      image: "/images/menu/fried-chicken.jpg",
      description: "",
      badge: "",
      calories: "280 kkal",
      pieces: "1 Porsi",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      image: p.image || "/images/menu/fried-chicken.jpg",
      description: p.description || "",
      badge: p.badge || "",
      calories: p.calories || "",
      pieces: p.pieces || "",
      isAvailable: p.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const categoryName = cat?.name || "Ayam Crispy";
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        categoryName,
        slug,
      });
      setFeedback(`Menu "${formData.name}" berhasil diperbarui!`);
    } else {
      addProduct({
        ...formData,
        categoryName,
        slug,
        isActive: true,
      });
      setFeedback(`Menu baru "${formData.name}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (p: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus menu "${p.name}"?`)) {
      deleteProduct(p.id);
      setFeedback(`Menu "${p.name}" berhasil dihapus.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === "all" || p.categoryId === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            CMS & KATALOG MENU RESTO
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Master Data Menu & Harga Produk (CRUD)
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Kelola menu aktif yang tampil serentak di Website Publik, Kasir POS, dan Online Order.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{feedback}</p>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama menu atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-red-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCat === "all" ? "bg-[#D32323] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Semua ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedCat === c.id ? "bg-[#D32323] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400 mb-4">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          {products.length === 0 ? (
            <>
              <h3 className="text-base font-bold text-zinc-800 mb-1">Katalog Menu Masih Kosong</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto mb-6">
                Belum ada produk menu yang terdaftar. Anda dapat menambahkan menu baru secara manual atau memuat katalog menu resmi standar D&apos;Besto.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-2.5 rounded-full transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Tambah Menu Pertama</span>
                </button>
                <button
                  onClick={() => {
                    seedOfficialMenu();
                    setFeedback("Katalog menu resmi D'Besto berhasil dimuat!");
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs px-5 py-2.5 rounded-full transition cursor-pointer"
                >
                  <span>Muat Katalog Menu Resmi</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-zinc-800 mb-1">Menu Tidak Ditemukan</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto mb-4">
                Tidak ada menu yang sesuai dengan kata kunci &quot;{search}&quot; atau kategori yang dipilih.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCat("all");
                }}
                className="text-xs font-bold text-[#D32323] hover:underline cursor-pointer"
              >
                Reset Filter & Pencarian
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
            >
              <div>
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src={p.image || "/images/menu/fried-chicken.jpg"}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    unoptimized
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-[#D32323] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {p.badge}
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
                      p.isAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    {p.isAvailable ? "Tersedia" : "Habis"}
                  </span>
                </div>

                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                    {p.categoryName}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 min-h-[32px]">
                    {p.description || "Menu ayam lezat resep khas D'Besto."}
                  </p>
                  <p className="text-base font-black text-[#D32323] pt-1">{formatRupiah(p.price)}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleProductAvailability(p.id)}
                  className={`flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    p.isAvailable
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                      : "text-zinc-600 bg-zinc-100 border-zinc-200 hover:bg-zinc-200"
                  }`}
                  title="Klik untuk ubah status stok"
                >
                  <span>{p.isAvailable ? "✓ Siap Jual" : "✕ Stok Habis"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                    title="Edit Menu"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal Form (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-zinc-900">
                  {editingProduct ? "Edit Menu Produk" : "Tambah Menu Baru"}
                </h3>
                <p className="text-xs text-zinc-500">
                  Isi informasi menu dan harga untuk dipublikasikan
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nama Menu:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Paket Cluck Special"
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Kategori Menu:</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Harga Jual (Rp):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Pilihan Gambar Produk:</label>
                <select
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] cursor-pointer"
                >
                  <option value="/images/menu/fried-chicken.jpg">Ayam Crispy Fried Chicken</option>
                  <option value="/images/menu/burger.jpg">D&apos;Besto Burger & Snack</option>
                  <option value="/images/hero/hero-plate.jpg">Paket Komplit Cluck Feast</option>
                  <option value="/images/hero/hero-food-clean.png">Banner Ayam Spesial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Badge Promo (Opsional):</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: BEST SELLER / FAVORIT"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Porsi / Ukuran:</label>
                  <input
                    type="text"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                    placeholder="Contoh: 1 Potong / Paket"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Deskripsi Menu:</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kelezatan ayam krispi khas D'Besto..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-[#D32323] rounded cursor-pointer"
                />
                <label htmlFor="availCheck" className="font-bold text-zinc-700 cursor-pointer">
                  Tersedia untuk dipesan saat ini (In Stock)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D32323] hover:bg-[#B31818] text-white font-bold shadow-md"
                >
                  {editingProduct ? "Simpan Perubahan" : "Tambah ke Katalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
