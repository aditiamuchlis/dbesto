"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { DollarSign, ShoppingCart, TrendingUp, Package, Printer } from "lucide-react";

export default function RestoLaporanPage() {
  const { currentOutlet, posOrders, stocks, shifts } = useAppStore();

  const orders = posOrders.filter((o) => o.outletId === currentOutlet.id);
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransactions = orders.length;
  const aov = totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0;

  const cashSales = orders
    .filter((o) => o.paymentMethod === "CASH")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const nonCashSales = totalSales - cashSales;

  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    setTodayStr(formatTanggalIndo(new Date().toISOString()));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            LAPORAN OPERASIONAL RESTO
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Rekap Penjualan & Inventaris Harian</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Tanggal: <strong>{todayStr || "Hari Ini"}</strong>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Total Omzet Harian</span>
          <p className="text-2xl font-black text-[#D32323]">{formatRupiah(totalSales)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Penjualan bersih cabang</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Total Struk / Tiket</span>
          <p className="text-2xl font-black text-zinc-900">{totalTransactions} Transaksi</p>
          <p className="text-[11px] text-zinc-500 mt-1">Rata-rata {formatRupiah(aov)}/order</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Penerimaan Tunai (Kasir)</span>
          <p className="text-2xl font-black text-emerald-600">{formatRupiah(cashSales)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Uang fisik laci kasir</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Non-Tunai (QRIS/Debit)</span>
          <p className="text-2xl font-black text-blue-600">{formatRupiah(nonCashSales)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Langsung masuk rekening resto</p>
        </div>
      </div>

      {/* Sisa Stok Bahan Baku Saat Ini */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-zinc-900">Sisa Stok Bahan Baku di Dapur</h3>
          <span className="text-xs text-zinc-500">Live inventory real-time</span>
        </div>

        {stocks.filter((s) => s.outletId === currentOutlet.id).length === 0 ? (
          <div className="p-8 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="font-semibold text-zinc-600 text-xs">Belum ada data stok bahan baku untuk cabang ini</p>
            <p className="text-[11px] text-zinc-400 mt-1">Stok bahan baku akan muncul setelah didaftarkan oleh Pusat atau melalui proses PO & Stock Opname.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stocks
              .filter((s) => s.outletId === currentOutlet.id)
              .map((stk) => (
                <div key={stk.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">{stk.materialCode}</span>
                  <h4 className="text-xs font-bold text-zinc-800 leading-snug">{stk.materialName}</h4>
                  <p className="text-lg font-black text-zinc-900 pt-1">
                    {stk.currentStock} <span className="text-xs font-normal text-zinc-500">{stk.unit}</span>
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
