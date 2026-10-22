"use client";

import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import { Package, Plus } from "lucide-react";

export default function MasterBahanBakuPage() {
  const { rawMaterials } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MASTER INVENTARIS PUSAT
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Master Data Bahan Baku (BOM)</h2>
          <p className="text-xs text-zinc-500 mt-1">Daftar bahan baku resmi standar resep dan pengadaan D&apos;Besto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rawMaterials.map((mat) => (
          <div key={mat.id} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
              {mat.code}
            </span>
            <h3 className="text-sm font-bold text-zinc-900 leading-snug">{mat.name}</h3>
            <p className="text-base font-black text-[#D32323]">
              {formatRupiah(mat.standardCost)} <span className="text-xs font-normal text-zinc-500">/ {mat.unit}</span>
            </p>
            <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
              Min. Stock Alert: <strong>{mat.minStockAlert} {mat.unit}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
