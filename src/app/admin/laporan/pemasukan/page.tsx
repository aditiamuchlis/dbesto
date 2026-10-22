"use client";

import { useState } from "react";
import { DollarSign, Download, Filter, Printer, FileSpreadsheet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";

export default function LaporanPemasukanPage() {
  const { outlets, posOrders } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState<string>("all");

  const filteredOrders =
    selectedOutlet === "all"
      ? posOrders
      : posOrders.filter((o) => o.outletId === selectedOutlet);

  const grossSales = filteredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalTax = filteredOrders.reduce((sum, o) => sum + o.taxAmount, 0);
  const totalDiscount = filteredOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const netRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleExportCSV = () => {
    const headers = ["Invoice", "Cabang", "Waktu", "Pelanggan", "Tipe", "Subtotal", "Pajak", "Diskon", "Total", "Metode"];
    const rows = filteredOrders.map((o) => [
      o.invoiceNumber,
      o.outletName || "-",
      o.createdAt,
      o.customerName,
      o.orderType,
      o.subtotal,
      o.taxAmount,
      o.discountAmount,
      o.totalAmount,
      o.paymentMethod,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-pemasukan-dbesto-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            KEUANGAN & OMZET
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan Pendapatan Konsolidasi Resto</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Rekap omzet kotor, pajak PB1, diskon promo, dan pendapatan bersih seluruh cabang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white"
          >
            <option value="all">Semua Cabang (Konsolidasi)</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Penjualan Kotor (Gross)</span>
          <p className="text-2xl font-black text-zinc-900">{formatRupiah(grossSales)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Diskon Promo</span>
          <p className="text-2xl font-black text-amber-600">{formatRupiah(totalDiscount)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Pajak Resto (PB1 10%)</span>
          <p className="text-2xl font-black text-blue-600">{formatRupiah(totalTax)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Pendapatan Bersih (Net)</span>
          <p className="text-2xl font-black text-[#D32323]">{formatRupiah(netRevenue)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Cabang Resto</th>
                <th className="p-3.5">Waktu Transaksi</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Subtotal</th>
                <th className="p-3.5">PB1 (10%)</th>
                <th className="p-3.5">Total Bayar</th>
                <th className="p-3.5">Metode</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-50/70">
                  <td className="p-3.5 font-mono font-bold text-zinc-900">{o.invoiceNumber}</td>
                  <td className="p-3.5 font-semibold text-zinc-700">{o.outletName}</td>
                  <td className="p-3.5 text-zinc-500">{formatTanggalIndo(o.createdAt, true)}</td>
                  <td className="p-3.5">{o.customerName}</td>
                  <td className="p-3.5">{formatRupiah(o.subtotal)}</td>
                  <td className="p-3.5">{formatRupiah(o.taxAmount)}</td>
                  <td className="p-3.5 font-black text-[#D32323]">{formatRupiah(o.totalAmount)}</td>
                  <td className="p-3.5 font-bold text-zinc-700">{o.paymentMethod}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {o.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
