"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { StockOpname } from "@/lib/types";

export default function RestoStockOpnameRiwayatPage() {
  const { currentOutlet, stockOpnames } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedOpname, setSelectedOpname] = useState<StockOpname | null>(null);

  const outletOpnames = stockOpnames.filter((o) => o.outletId === currentOutlet.id);
  const filtered =
    filterStatus === "ALL"
      ? outletOpnames
      : outletOpnames.filter((o) => o.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link href="/resto/stock-opname" className="hover:text-zinc-700">
              Stock Opname
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-amber-500 font-bold">Log Riwayat</span>
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Riwayat Audit Stock Opname</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Arsip perhitungan fisik inventaris bahan baku.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-100 border border-zinc-200 text-xs font-bold px-3 py-2 rounded-xl text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Status ({outletOpnames.length})</option>
            <option value="APPROVED">Disetujui (Approved)</option>
            <option value="SUBMITTED">Menunggu Approval</option>
            <option value="DRAFT">Draft</option>
          </select>

          <Link
            href="/resto/stock-opname"
            className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-red-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Opname Baru</span>
          </Link>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 font-extrabold uppercase">
                <th className="p-4">No. Opname</th>
                <th className="p-4">Waktu Audit</th>
                <th className="p-4">Auditor / Staf</th>
                <th className="p-4">Total Item</th>
                <th className="p-4 text-right">Nilai Selisih (Loss)</th>
                <th className="p-4">Status Approval</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    Belum ada riwayat stock opname untuk cabang ini.
                  </td>
                </tr>
              ) : (
                filtered.map((op) => (
                  <tr key={op.id} className="hover:bg-zinc-50/80 transition">
                    <td className="p-4 font-mono font-bold text-zinc-900">{op.opnameNumber}</td>
                    <td className="p-4 text-zinc-600">{formatTanggalIndo(op.opnameDate, true)}</td>
                    <td className="p-4 font-semibold text-zinc-800">{op.createdByName}</td>
                    <td className="p-4 font-bold">{op.items.length} Bahan</td>
                    <td className="p-4 text-right font-black text-red-600">
                      {formatRupiah(op.totalLossAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          op.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : op.status === "SUBMITTED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {op.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOpname(op)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#D32323] px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOpname && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#D32323]">RINCIAN AUDIT FISIK</span>
                <h3 className="font-black text-lg text-zinc-900">{selectedOpname.opnameNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOpname(null)}
                className="text-zinc-400 hover:text-black font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <span className="text-zinc-400 block">Waktu Pencatatan:</span>
                <strong>{formatTanggalIndo(selectedOpname.opnameDate, true)}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Petugas Pelaksana:</span>
                <strong>{selectedOpname.createdByName}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Status:</span>
                <span className="font-bold text-emerald-700">{selectedOpname.status}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Estimasi Selisih Kerugian:</span>
                <span className="font-black text-red-600">{formatRupiah(selectedOpname.totalLossAmount)}</span>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-zinc-400 font-bold uppercase">
                    <th className="pb-2">Nama Bahan Baku</th>
                    <th className="pb-2 text-right">Stok Sistem</th>
                    <th className="pb-2 text-right">Stok Fisik</th>
                    <th className="pb-2 text-right">Selisih (Variance)</th>
                    <th className="pb-2">Alasan Selisih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {selectedOpname.items.map((it) => (
                    <tr key={it.id} className="py-2">
                      <td className="py-2.5 font-bold text-zinc-900">{it.materialName}</td>
                      <td className="py-2.5 text-right">{it.systemStock} {it.unit}</td>
                      <td className="py-2.5 text-right font-black">{it.physicalStock} {it.unit}</td>
                      <td className={`py-2.5 text-right font-black ${it.difference < 0 ? "text-red-600" : "text-zinc-800"}`}>
                        {it.difference > 0 ? `+${it.difference}` : it.difference} {it.unit}
                      </td>
                      <td className="py-2.5 text-zinc-500 italic">{it.reason || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedOpname(null)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
