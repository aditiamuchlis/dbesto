"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import {
  Newspaper,
  Plus,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  FileText,
  X,
  Search,
} from "lucide-react";
import { Article } from "@/lib/types";

export default function AdminBeritaPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useAppStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("/images/hero/hero-banner-hd.jpg");

  const openAddModal = () => {
    setEditingArticle(null);
    setTitle("");
    setSummary("");
    setContent("");
    setCoverImage("/images/hero/hero-banner-hd.jpg");
    setIsModalOpen(true);
  };

  const openEditModal = (a: Article) => {
    setEditingArticle(a);
    setTitle(a.title);
    setSummary(a.summary);
    setContent(a.content);
    setCoverImage(a.coverImage || "/images/hero/hero-banner-hd.jpg");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title,
        slug,
        summary,
        content,
        coverImage,
      });
      setFeedback(`Artikel "${title}" berhasil diperbarui!`);
    } else {
      addArticle({
        title,
        slug,
        summary,
        content,
        coverImage,
        isPublished: true,
        publishedAt: new Date().toISOString(),
      });
      setFeedback(`Artikel baru "${title}" berhasil dipublikasikan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (a: Article) => {
    if (confirm(`Yakin ingin menghapus artikel "${a.title}"?`)) {
      deleteArticle(a.id);
      setFeedback(`Artikel "${a.title}" berhasil dihapus.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const togglePublish = (a: Article) => {
    updateArticle(a.id, { isPublished: !a.isPublished });
    setFeedback(`Status artikel "${a.title}" diperbarui.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            KONTEN & MEDIA BRAND (CRUD)
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Manajemen Berita & Artikel D&apos;Besto
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Publikasikan siaran pers, artikel kuliner, resep rahasia, serta informasi edukasi halal
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-5 py-3 rounded-full transition cursor-pointer shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tulis Artikel Baru</span>
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
          placeholder="Cari artikel berita berdasarkan judul atau isi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-zinc-800"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filtered.map((art) => (
          <div
            key={art.id}
            className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                <Image
                  src={art.coverImage || "/images/hero/hero-banner-hd.jpg"}
                  alt={art.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      art.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {art.isPublished ? "Tayang (Published)" : "Draft"}
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatTanggalIndo(art.publishedAt)}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 leading-snug">{art.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{art.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <Link
                href={`/berita/${art.slug}`}
                target="_blank"
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                title="Lihat di Web"
              >
                <Eye className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => togglePublish(art)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  art.isPublished
                    ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                    : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {art.isPublished ? "Jadikan Draft" : "Publikasikan"}
              </button>
              <button
                onClick={() => openEditModal(art)}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                title="Edit Artikel"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(art)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                title="Hapus Artikel"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Artikel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">
                {editingArticle ? "Edit Artikel Berita" : "Tulis Artikel Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahasia Kelezatan Ayam Crispy D'Besto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Ringkasan Singkat (Lead / Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk pratinjau berita..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Pilihan Gambar Sampul:</label>
                <select
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] cursor-pointer"
                >
                  <option value="/images/hero/hero-banner-hd.jpg">Banner Hero HD Ayam Crispy</option>
                  <option value="/images/hero/hero-plate.jpg">Paket Lengkap Piring Sajian</option>
                  <option value="/images/hero/hero-food-clean.png">Potongan Ayam Bersih</option>
                  <option value="/images/menu/fried-chicken.jpg">Fried Chicken Emas Gurih</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Isi Lengkap Artikel *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi artikel selengkapnya di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  {editingArticle ? "Simpan Perubahan" : "Publikasikan Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
