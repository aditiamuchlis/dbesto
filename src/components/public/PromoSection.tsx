"use client";

import Image from "next/image";
import { Tag, Calendar, ArrowRight, Copy, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export function PromoSection() {
  const { promotions } = useAppStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <section id="promo" className="py-16 bg-[#FFFDF7] border-y border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#D32323] block mb-1">
              PROMO SPESIAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Hemat & Nikmat Setiap Hari
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md">
            Gunakan voucher dan nikmati paket hemat favoritmu di seluruh cabang resto D&apos;Besto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={promo.bannerImage}
                  alt={promo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#D32323] text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-md flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{promo.discountValue || "PROMO"}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Periode: s/d {promo.endDate}</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#D32323] transition-colors">
                    {promo.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                {promo.code && (
                  <div className="pt-2 flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border border-dashed border-zinc-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                        Kode Kupon
                      </span>
                      <span className="font-mono font-black text-sm text-zinc-900 tracking-wider">
                        {promo.code}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(promo.code!)}
                      className="flex items-center gap-1 text-xs font-bold text-[#D32323] hover:text-[#B31818] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
