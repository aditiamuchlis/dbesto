"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Users,
  Building,
  HelpCircle,
  Phone,
  Send,
  ChevronRight,
  Store,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function KemitraanPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    hasLocation: "yes",
    investmentBudget: "85jt-150jt",
    experience: "no",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const packages = [
    {
      title: "Paket Booth Kontainer",
      investment: "Rp 85 Juta",
      suitableFor: "Teras Minimarket, Pujasera, Area Kampus",
      features: [
        "Booth container outdoor modern berukuran 3x2.5m",
        "Deep Fryer Gas komersial 2 tank 34 liter",
        "Sistem POS Kasir tablet & thermal printer",
        "Bahan baku awal senilai Rp 8.000.000",
        "Seragam staf, banner, dan neon box resmi",
        "Pelatihan SOP penggorengan dan pelayanan",
      ],
      popular: false,
    },
    {
      title: "Paket Outlet Ruko Standar",
      investment: "Rp 150 Juta",
      suitableFor: "Ruko 1 Lantai, Area Padat Penduduk (16-24 Seat)",
      features: [
        "Desain interior & eksterior standar D'Besto",
        "Deep fryer heavy duty, warmer display showcase",
        "Set meja kursi makan dine-in pelanggan",
        "Sistem operasional ERP POS, Stock Opname, PO HQ",
        "Bahan baku perdana senilai Rp 15.000.000",
        "Pendampingan intensif saat Grand Opening 3 hari",
      ],
      popular: true,
    },
    {
      title: "Paket Resto Dine-In Express",
      investment: "Rp 250 Juta",
      suitableFor: "Bangunan Mandiri / Ruko 2 Lantai (40+ Seat)",
      features: [
        "Konsep resto keluarga full AC & playground mini",
        "Peralatan dapur kapasitas ganda dan cold storage",
        "2 unit POS kasir terintegrasi sistem absensi GPS",
        "Dukungan kampanye digital marketing lokal",
        "Pasokan bahan baku terstandarisasi langsung gudang HQ",
        "Evaluasi bulanan performa bisnis & audit operasional",
      ],
      popular: false,
    },
  ];

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
            <span className="text-amber-400 font-semibold">Kemitraan Franchise</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
              PELUANG BISNIS KULINER TERBUKTI
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Kemitraan Franchise D&apos;Besto
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Bergabunglah dengan lebih dari 300+ cabang D&apos;Besto di seluruh Indonesia. Brand
              teruji, produk disukai jutaan keluarga, sistem operasional terintegrasi, dan BEP cepat.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-16">
        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">BEP Cepat (8-12 Bulan)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Model bisnis efisien dengan margin keuntungan sehat dan perputaran modal harian cepat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">Bahan Baku Terstandarisasi</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pasokan ayam marinasi dan bumbu rempah resmi langsung dikirim dari gudang pusat HQ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">Sistem ERP & POS Digital</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Dipersenjatai aplikasi kasir canggih, audit stock opname, PO bahan baku, dan absensi GPS.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900">Pelatihan & Support SOP</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Didampingi tim operasional berpengalaman dari survei lokasi hingga pembinaan berkala.
            </p>
          </div>
        </div>

        {/* Package Tiers */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
              PILIHAN PAKET INVESTASI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              Pilih Paket Kemitraan Sesuai Rencana Anda
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Biaya investasi transparan sudah mencakup perlengkapan dapur komplit dan hak lisensi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-300 ${
                  pkg.popular
                    ? "border-amber-400 ring-2 ring-amber-400/40 shadow-xl"
                    : "border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D32323] text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Paling Diminati</span>
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">{pkg.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{pkg.suitableFor}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                      <span className="text-[10px] text-zinc-400 font-bold block">Investasi Mulai:</span>
                      <p className="text-3xl font-black text-[#D32323]">{pkg.investment}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-zinc-800 block">Fasilitas Termasuk:</span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2.5 text-xs text-zinc-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#daftar-kemitraan"
                  className={`mt-8 w-full py-3.5 rounded-full text-xs font-bold text-center transition block cursor-pointer ${
                    pkg.popular
                      ? "bg-[#D32323] hover:bg-[#B31818] text-white shadow-md shadow-red-500/25"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  Pilih Paket Ini
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Steps to Join */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
              ALUR KERJASAMA
            </span>
            <h2 className="text-2xl font-black text-zinc-900">5 Langkah Menjadi Mitra D&apos;Besto</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            {[
              { step: "01", title: "Formulir Aplikasi", desc: "Isi data formulir minat dan profil calon mitra secara online." },
              { step: "02", title: "Survei Kelayakan", desc: "Tim survei HQ memverifikasi potensi traffic & demografi lokasi." },
              { step: "03", title: "Akad Kemitraan", desc: "Penandatanganan perjanjian resmi & pembayaran paket kemitraan." },
              { step: "04", title: "Instalasi & Training", desc: "Renovasi booth/outlet, setting peralatan, dan pelatihan staf resto." },
              { step: "05", title: "Grand Opening", desc: "Pembukaan resmi didampingi tim operasional kantor pusat." },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <span className="text-2xl font-black text-[#D32323] block">{s.step}</span>
                <h4 className="font-extrabold text-xs text-zinc-900">{s.title}</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div id="daftar-kemitraan" className="bg-[#181310] text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFC107]">
                FORMULIR KONSULTASI FRANCHISE
              </span>
              <h2 className="text-3xl font-black text-white">Daftarkan Minat Kemitraan Anda</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Isi data di bawah ini. Tim pengembangan franchise D&apos;Besto akan menghubungi
                Anda melalui WhatsApp dalam waktu 1x24 jam kerja.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-600 rounded-2xl p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Terima Kasih, {formData.name}!</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
                  Pengajuan kemitraan Anda untuk wilayah <strong>{formData.city}</strong> telah
                  berhasil diterima oleh HQ Pusat. Tim Business Development D&apos;Besto akan segera
                  menghubungi nomor WhatsApp <strong>{formData.phone}</strong>.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 bg-white text-zinc-900 text-xs font-bold px-6 py-2.5 rounded-full hover:bg-zinc-100 transition"
                >
                  Kirim Formulir Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC107]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">No. WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC107]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC107]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Kota / Kabupaten Rencana *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Depok / Jakarta / Bandung"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC107]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Kesiapan Lokasi Usaha</label>
                    <select
                      value={formData.hasLocation}
                      onChange={(e) => setFormData({ ...formData, hasLocation: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                    >
                      <option value="yes">Sudah Ada Lokasi (Milik Sendiri / Sewa)</option>
                      <option value="looking">Sedang Mencari Lokasi</option>
                      <option value="hq_survey">Minta Rekomendasi Lokasi dari HQ</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Alokasi Anggaran Investasi</label>
                    <select
                      value={formData.investmentBudget}
                      onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                    >
                      <option value="85jt">Rp 85 Juta (Paket Booth)</option>
                      <option value="85jt-150jt">Rp 85 - 150 Juta (Paket Ruko Standar)</option>
                      <option value="above-200jt">&gt; Rp 200 Juta (Paket Resto Express)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Catatan Tambahan / Pertanyaan</label>
                  <textarea
                    rows={3}
                    placeholder="Ceritakan rencana lokasi atau pertanyaan yang ingin Anda konsultasikan..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC107]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-full shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Formulir Pendaftaran Franchise</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
