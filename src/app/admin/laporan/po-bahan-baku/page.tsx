"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function AdminLaporanPoPage() {
  const { purchaseOrders, outlets, updatePoStatus } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState("all");

  const filtered =
    selectedOutlet === "all"
      ? purchaseOrders
      : purchaseOrders.filter((po) => po.outletId === selectedOutlet);

  const totalPoValue = filtered.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            SUPPLY CHAIN & LOGISTIK
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan & Approval PO Bahan Baku</h2>
          <p className="text-xs text-zinc-500 mt-1">Verifikasi pengadaan pasokan bahan baku dari gudang pusat ke resto</p>
        </div>

        <div className="flex items-center gap-3">
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

          <span className="text-xs font-black text-[#D32323] bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl">
            Total Belanja Bahan: {formatRupiah(totalPoValue)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">No. PO</th>
                <th className="p-3.5">Cabang Resto</th>
                <th className="p-3.5">Tanggal Order</th>
                <th className="p-3.5">Rincian Pasokan</th>
                <th className="p-3.5">Total Biaya</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Tindakan HQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-zinc-50/70">
                  <td className="p-3.5 font-mono font-bold text-zinc-900">{po.poNumber}</td>
                  <td className="p-3.5 font-semibold text-zinc-800">{po.outletName}</td>
                  <td className="p-3.5 text-zinc-500">{formatTanggalIndo(po.orderDate, true)}</td>
                  <td className="p-3.5">
                    <ul className="space-y-0.5">
                      {po.items.map((it) => (
                        <li key={it.id} className="text-zinc-700">
                          • {it.materialName}: <strong>{it.orderedQty} {it.unit}</strong> ({formatRupiah(it.subtotal)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3.5 font-black text-[#D32323]">{formatRupiah(po.totalAmount)}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        po.status === "RECEIVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : po.status === "APPROVED_BY_HQ" || po.status === "IN_DELIVERY"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {po.status === "SUBMITTED" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updatePoStatus(po.id, "APPROVED_BY_HQ")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                        >
                          Approve PO
                        </button>
                        <button
                          onClick={() => updatePoStatus(po.id, "REJECTED")}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : po.status === "APPROVED_BY_HQ" ? (
                      <button
                        onClick={() => updatePoStatus(po.id, "IN_DELIVERY")}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                      >
                        Kirim Truk Logistik
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-medium">Tuntas</span>
                    )}
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
