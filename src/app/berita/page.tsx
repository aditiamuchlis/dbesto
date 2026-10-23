"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import { Calendar, Clock, ChevronRight, Newspaper, ArrowRight, Search } from "lucide-react";

export default function BeritaPage() {
  const { articles } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  const extraArticles = [
    {
      id: "art-03",
      title: "Ekspansi 2026: D'Besto Resmikan 50 Cabang Baru di Jawa & Sumatera",
      slug: "ekspansi-2026-50-cabang-baru",
      summary: "Memperluas jangkauan layanan kuliner terjangkau dan berkualitas ke kota-kota lapis kedua dan ketiga di Indonesia.",
      content: "Sebagai wujud komitmen menghadirkan sajian ayam krispi halal terbaik untuk seluruh lapisan masyarakat, D'Besto menargetkan pembukaan 50 cabang resto baru sepanjang tahun 2026...",
      coverImage: "/images/hero/hero-food-clean.png",
      isPublished: true,
      publishedAt: "2026-10-05T08:00:00Z",
    },
    {
      id: "art-04",
      title: "Tips Memilih Olahan Ayam Goreng Krispi yang Sehat & Aman untuk Anak",
      slug: "tips-memilih-ayam-goreng-sehat",
      summary: "Ketahui standar keamanan pangan, penggantian minyak berkala, dan daging ayam tanpa hormon pengawet.",
      content: "Banyak orang tua khawatir dengan kualitas makanan cepat saji untuk si kecil. D'Besto membagikan panduan memilih olahan ayam higienis dengan standar SOP penggantian minyak nabati setiap hari...",
      coverImage: "/images/menu/fried-chicken.jpg",
      isPublished: true,
      publishedAt: "2026-09-28T11:00:00Z",
    },
  ];

  const allArticles = [...articles, ...extraArticles];

  const filtered = allArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  const featured = allArticles[0];

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
            <span className="text-amber-400 font-semibold">Kabar & Berita</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
                KABAR TERKINI D&apos;BESTO
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Berita, Inspirasi & Informasi
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-xl">
                Ikuti perkembangan terkini seputar menu baru, info sertifikasi halal, program promo,
                dan kisah inspiratif jaringan resto D&apos;Besto.
              </p>
            </div>

            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Cari artikel berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:bg-zinc-900 focus:border-[#FFC107] transition"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Featured Article Card */}
        {featured && !search && (
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-zinc-100 overflow-hidden">
              <Image
                src={featured.coverImage || "/images/hero/hero-banner-hd.jpg"}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-black text-[#D32323] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full w-fit block">
                  ARTIKEL UTAMA
                </span>
                <Link href={`/berita/${featured.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight group-hover:text-[#D32323] transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatTanggalIndo(featured.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>3 Menit Baca</span>
                  </div>
                </div>

                <Link
                  href={`/berita/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#D32323] hover:text-[#B31818]"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-zinc-900">Semua Berita & Artikel Terkini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/berita/${item.slug}`} className="block relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                    <Image
                      src={item.coverImage || "/images/hero/hero-banner-hd.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTanggalIndo(item.publishedAt)}
                      </span>
                    </div>

                    <Link href={`/berita/${item.slug}`}>
                      <h4 className="font-black text-zinc-900 text-lg group-hover:text-[#D32323] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-zinc-100 flex items-center justify-between mt-4">
                  <span className="text-[11px] font-semibold text-zinc-400">D&apos;Besto Press</span>
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#D32323] hover:underline"
                  >
                    <span>Baca Artikel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
