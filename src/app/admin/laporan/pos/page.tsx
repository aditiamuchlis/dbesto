"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { ShoppingCart, Eye } from "lucide-react";

export default function AdminLaporanPosPage() {
  const { posOrders, outlets } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState("all");

  const filtered =
    selectedOutlet === "all"
      ? posOrders
      : posOrders.filter((o) => o.outletId === selectedOutlet);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            AUDIT KASIR
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan Transaksi POS Seluruh Resto</h2>
          <p className="text-xs text-zinc-500 mt-1">Audit seluruh tiket order kasir dan rincian menu</p>
        </div>

        <select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          className="text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white"
        >
          <option value="all">Semua Cabang Resto</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Cabang</th>
                <th className="p-3.5">Kasir</th>
                <th className="p-3.5">Waktu</th>
                <th className="p-3.5">Rincian Menu Item</th>
                <th className="p-3.5">Total Bayar</th>
                <th className="p-3.5">Metode</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-50/70">
                  <td className="p-3.5 font-mono font-bold text-zinc-900">{ord.invoiceNumber}</td>
                  <td className="p-3.5 font-semibold text-zinc-700">{ord.outletName}</td>
                  <td className="p-3.5 text-zinc-600">{ord.cashierName || "Kasir"}</td>
                  <td className="p-3.5 text-zinc-500">{formatTanggalIndo(ord.createdAt, true)}</td>
                  <td className="p-3.5">
                    <ul className="space-y-0.5">
                      {ord.items.map((it) => (
                        <li key={it.id} className="text-zinc-700 font-medium">
                          • {it.quantity}x {it.productName} ({formatRupiah(it.subtotal)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3.5 font-black text-[#D32323]">{formatRupiah(ord.totalAmount)}</td>
                  <td className="p-3.5 font-bold text-zinc-700">{ord.paymentMethod}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {ord.paymentStatus}
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
