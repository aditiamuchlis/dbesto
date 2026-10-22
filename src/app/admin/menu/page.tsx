"use client";

import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import { UtensilsCrossed, Plus } from "lucide-react";

export default function AdminMenuPage() {
  const { products, categories } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            CMS & KATALOG
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Master Data Menu & Harga Produk</h2>
          <p className="text-xs text-zinc-500 mt-1">Kelola daftar menu yang tampil pada Website Publik dan Aplikasi POS Kasir</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/3] bg-zinc-100">
                <Image src={p.image || "/images/menu/fried-chicken.jpg"} alt={p.name} fill className="object-cover" />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-[#D32323] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase">{p.categoryName}</span>
                <h3 className="text-xs font-bold text-zinc-900 leading-snug mt-0.5">{p.name}</h3>
                <p className="text-base font-black text-[#D32323] mt-2">{formatRupiah(p.price)}</p>
              </div>
            </div>
            <div className="p-4 pt-0 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>{p.isAvailable ? "Tersedia" : "Habis"}</span>
              <span className="text-emerald-600 font-bold">Aktif di POS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
