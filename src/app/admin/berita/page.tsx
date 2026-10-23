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
  Edit,
  Trash2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Article } from "@/lib/types";

export default function AdminBeritaPage() {
  const { articles } = useAppStore();
  const [list, setList] = useState<Article[]>(articles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newArt: Article = {
      id: `art-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary,
      content,
      coverImage: "/images/hero/hero-banner-hd.jpg",
      isPublished: true,
      publishedAt: new Date().toISOString(),
    };
    setList([newArt, ...list]);
    setIsModalOpen(false);
    setTitle("");
    setSummary("");
    setContent("");
  };

  const togglePublish = (id: string) => {
    setList(
      list.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            KONTEN & MEDIA BRAND
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Manajemen Berita & Artikel D&apos;Besto</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Publikasikan siaran pers, artikel kuliner resep rahasia, serta informasi edukasi halal.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="font-black text-base text-zinc-900">Daftar Artikel ({list.length})</h3>
          <span className="text-xs text-zinc-400 font-semibold">Tampil di halaman /berita</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {list.map((article) => (
            <div key={article.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                  <Image
                    src={article.coverImage || "/images/hero/hero-banner-hd.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-900">{article.title}</h4>
                    {article.isPublished ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Tayang
                      </span>
                    ) : (
                      <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 max-w-xl">{article.summary}</p>
                  <p className="text-[11px] text-zinc-400">
                    Dipublikasikan: {formatTanggalIndo(article.publishedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={`/berita/${article.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold transition"
                >
                  Lihat di Web
                </Link>
                <button
                  onClick={() => togglePublish(article.id)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    article.isPublished
                      ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {article.isPublished ? "Tarik Draft" : "Publikasikan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tulis Artikel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">Tulis Siaran Artikel Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Standar Mutu Penggorengan D'Besto..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Ringkasan Singkat (Lead / Summary) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Isi Konten Artikel *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan naskah lengkap artikel di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  Publikasikan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
