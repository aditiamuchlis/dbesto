"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { ClipboardList, CheckCircle2, TrendingDown, AlertTriangle } from "lucide-react";

export default function AdminStockOpnamePage() {
  const { stockOpnames, outlets, approveStockOpname } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState("all");

  const filtered =
    selectedOutlet === "all"
      ? stockOpnames
      : stockOpnames.filter((o) => o.outletId === selectedOutlet);

  const totalLoss = filtered.reduce((sum, o) => sum + o.totalLossAmount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            AUDIT INVENTARIS HQ
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan Selisih Stok & Nilai Kerugian</h2>
          <p className="text-xs text-zinc-500 mt-1">Audit variansi perhitungan fisik bahan baku seluruh cabang resto</p>
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

          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-xs font-black text-[#D32323]">
              Total Selisih: {formatRupiah(totalLoss)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">No. Dokumen</th>
                <th className="p-3.5">Cabang Resto</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Petugas Input</th>
                <th className="p-3.5">Rincian Variansi Bahan</th>
                <th className="p-3.5">Estimasi Rugi</th>
                <th className="p-3.5">Catatan</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Persetujuan HQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400">
                    <p className="font-semibold text-zinc-500">Belum ada rekonsiliasi Stock Opname</p>
                    <p className="text-[11px] mt-1 text-zinc-400">Laporan selisih fisik bahan baku dari resto akan tampil di sini untuk verifikasi penyesuaian stok sistem.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((op) => (
                  <tr key={op.id} className="hover:bg-zinc-50/70">
                    <td className="p-3.5 font-mono font-bold text-zinc-900">{op.opnameNumber}</td>
                    <td className="p-3.5 font-semibold text-zinc-800">{op.outletName}</td>
                    <td className="p-3.5 text-zinc-500">{formatTanggalIndo(op.opnameDate, true)}</td>
                    <td className="p-3.5 text-zinc-700">{op.createdByName}</td>
                    <td className="p-3.5">
                      <ul className="space-y-1">
                        {op.items.map((it) => (
                          <li key={it.id} className="text-zinc-700">
                            <strong>{it.materialName}:</strong> {it.physicalStock} / {it.systemStock} (
                            <span className={it.difference < 0 ? "text-red-600 font-bold" : "text-zinc-500"}>
                              {it.difference > 0 ? `+${it.difference}` : it.difference} {it.unit}
                            </span>
                            ) {it.reason && `— ${it.reason}`}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3.5 font-black text-red-600">{formatRupiah(op.totalLossAmount)}</td>
                    <td className="p-3.5 text-zinc-500 max-w-xs truncate">{op.notes || "-"}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          op.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {op.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {op.status === "SUBMITTED" ? (
                        <button
                          onClick={() => approveStockOpname(op.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                        >
                          Approve Penyesuaian
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">Telah Di-Approve</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
