"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, Award } from "lucide-react";

interface HeroSectionProps {
  onOrderNow?: () => void;
}

export function HeroSection({ onOrderNow }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#181310] text-white">
      {/* Background warm rustic glow & wooden table texture */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-banner-hd.jpg"
          alt="D'Besto Hero Meal Background"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120e0b] via-[#1a1411]/90 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 text-left">
            {/* Subtle Halal & Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 w-fit text-xs font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Halal MUI & Ayam Segar Berkualitas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Nikmati Menu Favorit{" "}
              <span className="text-[#FFC107] font-black drop-shadow-[0_2px_10px_rgba(255,193,7,0.3)]">
                D&apos;Besto
              </span>{" "}
              di Setiap Momen
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
              Dari ayam berkualitas hingga pilihan menu lezat lainnya, D&apos;Besto selalu hadir
              untuk menemani hari harimu.
            </p>

            {/* Button Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="inline-flex items-center justify-center bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Pesan Sekarang
              </button>

              <Link
                href="#menu"
                className="inline-flex items-center justify-center bg-zinc-900/60 hover:bg-zinc-900/90 text-white font-semibold text-base px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                Lihat Menu
              </Link>
            </div>

            {/* Trust rating indicator */}
            <div className="flex items-center gap-6 pt-4 text-xs sm:text-sm text-zinc-400 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-base">★ 4.9/5</span>
                <span>Kepuasan Pelanggan</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>300+ Cabang di Indonesia</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Food Spread */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src="/images/hero/hero-plate.jpg"
                alt="Paket Komplit Ayam Goreng Crispy D'Besto, Nasi Pulen, Sambal dan Es Teh"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 580px"
              />

              {/* Subtle vignette & warm edge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Crispy Tag */}
              <div className="absolute bottom-4 left-4 bg-zinc-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2.5 shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Fresh From Fryer</p>
                  <p className="text-[10px] text-zinc-300">Ayam digoreng dadakan saat pesanan tiba</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
