"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import {
  ShieldCheck,
  Award,
  Heart,
  Users,
  Store,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function TentangKamiPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {}}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#181310] to-[#261D17] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-amber-400 font-semibold">Tentang Kami</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
              KARYA ANAK BANGSA UNTUK INDONESIA
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Cerita & Komitmen D&apos;Besto
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Berawal dari mimpi sederhana menghadirkan ayam goreng krispi lezat, higienis, dan 100%
              halal yang terjangkau bagi seluruh keluarga Indonesia.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#D32323] bg-red-50 px-3 py-1 rounded-full">
              SEJARAH & FILOSOFI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight">
              Dari Dapur Kecil Menuju Jaringan 300+ Cabang Nasional
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              D&apos;Besto lahir dari perpaduan kecintaan terhadap kuliner khas nusantara dan tekad
              memberikan alternatif hidangan cepat saji yang aman, bergizi, dan halal bagi
              masyarakat luas.
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Dengan mengombinasikan daging ayam segar pilihan yang dipotong sesuai syariat, racikan
              rempah alami beraroma khas, dan teknik penggorengan higienis berstandar modern,
              D&apos;Besto tumbuh menjadi salah satu brand kuliner cepat saji lokal paling dicintai
              di tanah air.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-zinc-800">Top Local Brand</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-zinc-800">100% Halal Resmi MUI</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
            <Image
              src="/images/hero/hero-banner-hd.jpg"
              alt="D'Besto Brand Story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                KUALITAS TANPA KOMPROMI
              </span>
              <p className="text-base font-bold">Renyah di Luar, Gurih Lembut Meresap di Dalam</p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">Visi Kami</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Menjadi jaringan restoran cepat saji lokal nomor satu di Indonesia yang terpercaya,
              higienis, dan membawa keberkahan serta kebahagiaan bagi pelanggan, mitra franchise,
              dan masyarakat luas.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">Misi Kami</h3>
            <ul className="text-sm text-zinc-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                <span>Menyajikan makanan berkualitas tinggi dengan standar kehalalan yang teguh.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                <span>Memberdayakan ratusan wirausahawan lokal melalui sistem kemitraan terpadu.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                <span>Menciptakan ribuan lapangan kerja dan mendukung ekosistem peternak ayam nasional.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
              NILAI-NILAI UTAMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              4 Pilar Kualitas D&apos;Besto
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="text-3xl font-black text-[#D32323] block">100%</span>
              <h4 className="font-bold text-sm text-zinc-900">Halal MUI</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Jaminan kehalalan mulai dari RPH, bumbu marinasi, hingga proses penyajian di resto.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="text-3xl font-black text-[#D32323] block">12 Jam</span>
              <h4 className="font-bold text-sm text-zinc-900">Marinasi Dingin</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Rempah nusantara meresap sempurna hingga ke serat tulang terdalam daging ayam.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="text-3xl font-black text-[#D32323] block">300+</span>
              <h4 className="font-bold text-sm text-zinc-900">Gerai Cabang</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Tersebar luas di kota-kota besar melayani pemesanan cepat setiap hari.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="text-3xl font-black text-[#D32323] block">100%</span>
              <h4 className="font-bold text-sm text-zinc-900">Minyak Nabati Berkala</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Penggantian minyak goreng rutin untuk menjamin warna emas krispi dan kesehatan.
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
              PERJALANAN KAMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              Jejak Langkah Tumbuh Bersama
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { year: "2010", title: "Awal Berdiri", desc: "Gerai perdana D'Besto dibuka melayani pelanggan setia dengan resep otentik." },
              { year: "2016", title: "Ekspansi Jabodetabek", desc: "Mencapai 50 gerai dan meluncurkan kemitraan terstruktur dengan mitra lokal." },
              { year: "2021", title: "Transformasi Digital", desc: "Implementasi sistem cloud ERP & POS kasir terintegrasi di seluruh cabang." },
              { year: "2026", title: "300+ Gerai Nasional", desc: "Menjadi jaringan resto cepat saji ayam krispi lokal terkemuka di Indonesia." },
            ].map((m) => (
              <div key={m.year} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
                <span className="text-xl font-black text-amber-500">{m.year}</span>
                <h4 className="font-black text-base text-zinc-900">{m.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{m.desc}</p>
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
