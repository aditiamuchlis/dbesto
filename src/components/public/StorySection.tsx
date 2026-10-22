"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, HeartHandshake, CheckCircle2 } from "lucide-react";

export function StorySection() {
  return (
    <section id="tentang-kami" className="py-20 bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-t from-red-950/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Image Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/hero/hero-banner-hd.jpg"
                alt="Ayam Crispy D'Besto Berkualitas"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#D32323] p-5 rounded-2xl shadow-xl border border-white/10 hidden sm:flex items-center gap-3.5">
              <ShieldCheck className="w-10 h-10 text-white stroke-[2]" />
              <div>
                <p className="text-sm font-black text-white leading-tight">100% Halal MUI</p>
                <p className="text-[11px] text-red-100">Kualitas & Higienitas Terjamin</p>
              </div>
            </div>
          </div>

          {/* Right: Brand Values & Partnership */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#FFC107] block">
              TENTANG D&apos;BESTO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Sajian Ayam Krispi Juara untuk Seluruh Keluarga Indonesia
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Berawal dari komitmen menyajikan hidangan ayam goreng lezat bercita rasa rempah asli
              dengan harga terjangkau, D&apos;Besto terus tumbuh menjadi salah satu jaringan restoran
              cepat saji terpercaya dengan ratusan cabang di berbagai pelosok nusantara.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Rempah Alami Nusantara</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Marinasi khusus 12 jam meresap maksimal.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Standar Keamanan Pangan</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">SOP kebersihan dapur dan peralatan berkala.</p>
                </div>
              </div>
            </div>

            {/* Franchise CTA Card */}
            <div id="kemitraan" className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 to-zinc-900 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-3.5">
                <HeartHandshake className="w-9 h-9 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-white">Peluang Kemitraan Franchise</h4>
                  <p className="text-xs text-zinc-400">Bergabunglah menjadi mitra sukses bisnis resto D&apos;Besto.</p>
                </div>
              </div>
              <a
                href="https://wa.me/6281288776600?text=Halo%20D'Besto,%20saya%20tertarik%20dengan%20kemitraan%20franchise"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-6 py-2.5 bg-[#FFC107] hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm rounded-full transition shadow-md cursor-pointer"
              >
                Hubungi Tim Kemitraan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
