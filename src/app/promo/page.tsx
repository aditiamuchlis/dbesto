"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import {
  Tag,
  Copy,
  Check,
  Calendar,
  Gift,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";

export default function PromoPage() {
  const { promotions } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
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
            <span className="text-amber-400 font-semibold">Promo & Kupon</span>
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
              HEMAT MAKSIMAL DI SETIAP MOMEN
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Promo Spesial & Kupon D&apos;Besto
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-xl">
              Gunakan kupon diskon dan manfaatkan penawaran terbatas untuk menikmati menu ayam krispi
              favorit dengan harga paling hemat!
            </p>
          </div>
        </div>
      </section>

      {/* Promo Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {promotions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-red-50 text-[#D32323] rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-[#D32323]" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Belum Ada Promo Aktif</h3>
            <p className="text-xs text-zinc-500">
              Nantikan program promo, kupon diskon, dan voucher hemat berikutnya dari D&apos;Besto!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo) => {
              const isCopied = copiedCode === promo.code;
              return (
                <div
                  key={promo.id}
                  className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                <div>
                  {/* Banner Image */}
                  <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                    <Image
                      src={promo.bannerImage || "/images/hero/hero-banner-hd.jpg"}
                      alt={promo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-[#D32323] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
                      <span>{promo.discountValue}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-black drop-shadow-md leading-tight">
                        {promo.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {promo.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span>
                        Periode: <strong>{promo.startDate}</strong> s/d <strong>{promo.endDate}</strong>
                      </span>
                    </div>

                    {/* Voucher Code Box */}
                    {promo.code && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-amber-700 uppercase block">
                            Kode Voucher Kupon:
                          </span>
                          <span className="text-base font-black text-zinc-900 tracking-wider font-mono">
                            {promo.code}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyCode(promo.code!)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#D32323] hover:bg-[#B31818] text-white"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Kode</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-zinc-100 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Berlaku di seluruh cabang</span>
                  </div>

                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition"
                  >
                    <span>Gunakan Promo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* Terms & Conditions Notice */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 font-black text-base">
            <Info className="w-5 h-5 text-[#D32323]" />
            <h3>Syarat & Ketentuan Umum Promo D&apos;Besto</h3>
          </div>
          <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5 leading-relaxed">
            <li>Promo berlaku untuk dine-in, takeaway, serta pemesanan online melalui website resmi D&apos;Besto.</li>
            <li>Kode kupon dapat dimasukkan pada halaman checkout kasir atau kolom catatan pesanan.</li>
            <li>Promo tidak dapat digabungkan dengan program voucher diskon kemitraan lainnya kecuali dinyatakan secara khusus.</li>
            <li>Manajemen D&apos;Besto berhak mengubah ketentuan promo sewaktu-waktu sesuai ketersediaan bahan baku di masing-masing cabang resto.</li>
          </ul>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
