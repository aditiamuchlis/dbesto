"use client";

import { use, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import {
  ChevronRight,
  Calendar,
  Clock,
  Share2,
  Check,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ArticleDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const { articles } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const article = articles.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => {}}
          onOrderNow={() => setIsCartOpen(true)}
        />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900">Artikel Tidak Ditemukan</h2>
            <p className="text-xs text-zinc-500">
              Artikel berita yang Anda cari tidak tersedia atau belum dipublikasikan.
            </p>
            <Link
              href="/berita"
              className="inline-block bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md"
            >
              ← Kembali ke Kabar & Berita
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {}}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-zinc-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/berita" className="hover:text-zinc-900 transition">
            Berita
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[#D32323] font-bold truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        <article className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-12 shadow-sm space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <span className="text-xs font-black text-[#D32323] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full w-fit block">
              PRESS RELEASE RESMI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-b border-zinc-100 py-3 text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {formatTanggalIndo(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  3 Menit Membaca
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-[#D32323] transition cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{isCopied ? "Link Tersalin!" : "Bagikan Artikel"}</span>
              </button>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 shadow-md">
            <Image
              src={article.coverImage || "/images/hero/hero-banner-hd.jpg"}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed space-y-5 text-sm sm:text-base">
            <p className="font-semibold text-base sm:text-lg text-zinc-900 leading-relaxed">
              {article.summary}
            </p>

            <p>
              Di balik renyahnya kulit ayam D&apos;Besto dan aroma sedap yang menggugah selera, terdapat komitmen mendalam terhadap higienitas dan cita rasa otentik khas nusantara. Seluruh ayam yang digunakan dipasok dari peternakan lokal terpercaya dengan sertifikasi Good Manufacturing Practice (GMP).
            </p>

            <div className="p-6 rounded-2xl bg-[#FFFDF7] border-l-4 border-[#D32323] my-6 space-y-2">
              <p className="font-bold text-zinc-900 italic">
                &quot;Kepercayaan jutaan keluarga Indonesia adalah amanah utama kami. Oleh karena itu, setiap potong ayam D&apos;Besto melewati proses marinasi dingin 12 jam agar rempah meresap ke serat daging terdalam.&quot;
              </p>
              <span className="text-xs text-zinc-500 font-bold block">
                — Tim Pengendali Mutu D&apos;Besto HQ
              </span>
            </div>

            <h3 className="text-xl font-black text-zinc-900 pt-2">
              Standar Kehalalan & Pengendalian Mutu Menyeluruh
            </h3>
            <p>
              Seluruh proses dari pemotongan ayam di RPH berstandar halal MUI, pengolahan bumbu marinasi, hingga teknik penggorengan di deep fryer bertekanan stabil telah dibakukan dalam SOP operasional terpusat. Melalui sistem audit inventaris dan quality control harian di setiap cabang resto, mutu ayam goreng yang tersaji di meja konsumen dipastikan selalu prima dan renyah.
            </p>

            <p>
              Pelanggan dapat menikmati aneka sajian khas D&apos;Besto baik dengan datang langsung ke gerai terdekat maupun melakukan pemesanan praktis secara online melalui portal resmi kami.
            </p>
          </div>

          {/* Author footer */}
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D32323] text-white flex items-center justify-center font-black text-sm">
                D&apos;B
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900">Departemen Komunikasi Brand</h4>
                <p className="text-[11px] text-zinc-500">PT D&apos;Besto Kuliner Indonesia</p>
              </div>
            </div>

            <Link
              href="/menu"
              className="bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-5 py-2.5 rounded-full transition"
            >
              Pesan Menu Sekarang
            </Link>
          </div>
        </article>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Indeks Berita</span>
          </Link>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function ArticleDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-[#D32323] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ArticleDetailContent {...props} />
    </Suspense>
  );
}
