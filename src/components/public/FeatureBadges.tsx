"use client";

import { Drumstick, ChefHat, ShieldCheck, Store } from "lucide-react";

export function FeatureBadges() {
  const features = [
    {
      icon: Drumstick,
      title: "Bahan Berkualitas",
      description: "Kami menggunakan bahan pilihan terbaik",
      detail: "Ayam segar dipotong higienis setiap hari dari peternakan bersertifikasi.",
    },
    {
      icon: ChefHat,
      title: "Resep Istimewa",
      description: "Kami menggunakan bahan pilihan terbaik",
      detail: "Bumbu racikan rempah nusantara khas D'Besto meresap hingga ke tulang.",
    },
    {
      icon: ShieldCheck,
      title: "100% Halal MUI",
      description: "Kami menggunakan bahan pilihan terbaik",
      detail: "Jaminan kehalalan menyeluruh dan proses higienis standar sertifikasi resmi.",
    },
    {
      icon: Store,
      title: "Ratusan Cabang",
      description: "Kami menggunakan bahan pilihan terbaik",
      detail: "Jaringan resto tersebar luas siap melayani pemesanan cepat di kotamu.",
    },
  ];

  return (
    <section className="bg-[#FFFDF7] border-b border-zinc-200/80 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-zinc-200/80">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center px-4 pt-6 sm:pt-0 group hover:translate-y-[-2px] transition-transform duration-200"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#D32323] mb-4 bg-red-50/50 group-hover:bg-red-100/70 group-hover:scale-110 transition-all duration-200">
                  <Icon className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-[220px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
