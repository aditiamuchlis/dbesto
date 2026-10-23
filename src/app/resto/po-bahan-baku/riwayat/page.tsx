"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import {
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import { PurchaseOrder } from "@/lib/types";

export default function RestoPoRiwayatPage() {
  const { currentOutlet, purchaseOrders, updatePoStatus } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  const outletPos = purchaseOrders.filter((po) => po.outletId === currentOutlet.id);
  const filtered =
    filterStatus === "ALL" ? outletPos : outletPos.filter((po) => po.status === filterStatus);

  const handleReceive = (poId: string) => {
    updatePoStatus(poId, "RECEIVED");
    alert("Penerimaan barang berhasil dikonfirmasi! Stok bahan baku di resto telah otomatis bertambah.");
    setSelectedPo(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link href="/resto/po-bahan-baku" className="hover:text-zinc-700">
              PO Bahan Baku
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-amber-500 font-bold">Riwayat & Penerimaan</span>
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Riwayat Pengadaan Bahan Baku</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Pelacakan status pengiriman dan konfirmasi penerimaan barang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-100 border border-zinc-200 text-xs font-bold px-3 py-2 rounded-xl text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Status ({outletPos.length})</option>
            <option value="SUBMITTED">Diajukan (Submitted)</option>
            <option value="APPROVED_BY_HQ">Disetujui HQ</option>
            <option value="IN_DELIVERY">Dalam Pengiriman</option>
            <option value="RECEIVED">Diterima (Received)</option>
          </select>

          <Link
            href="/resto/po-bahan-baku"
            className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-red-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat PO Baru</span>
          </Link>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 font-extrabold uppercase">
                <th className="p-4">No. PO</th>
                <th className="p-4">Tanggal Order</th>
                <th className="p-4">Target Tiba</th>
                <th className="p-4">Pemohon</th>
                <th className="p-4 text-right">Total Nilai Bahan</th>
                <th className="p-4">Status Siklus</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    Belum ada riwayat Purchase Order untuk cabang ini.
                  </td>
                </tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-zinc-50/80 transition">
                    <td className="p-4 font-mono font-bold text-zinc-900">{po.poNumber}</td>
                    <td className="p-4 text-zinc-600">{formatTanggalIndo(po.orderDate, true)}</td>
                    <td className="p-4 text-zinc-600">{po.deliveryDate || "-"}</td>
                    <td className="p-4 font-semibold text-zinc-800">{po.createdByName}</td>
                    <td className="p-4 text-right font-black text-[#D32323]">
                      {formatRupiah(po.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          po.status === "RECEIVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : po.status === "IN_DELIVERY"
                            ? "bg-blue-100 text-blue-800"
                            : po.status === "APPROVED_BY_HQ"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedPo(po)}
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

      {/* PO Detail & Goods Receipt Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#D32323]">RINCIAN PURCHASE ORDER</span>
                <h3 className="font-black text-lg text-zinc-900">{selectedPo.poNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedPo(null)}
                className="text-zinc-400 hover:text-black font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <span className="text-zinc-400 block">Waktu Pengajuan:</span>
                <strong>{formatTanggalIndo(selectedPo.orderDate, true)}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Target Tanggal Tiba:</span>
                <strong>{selectedPo.deliveryDate || "-"}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Status Pengiriman:</span>
                <span className="font-bold text-amber-700">{selectedPo.status}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Total Belanja:</span>
                <span className="font-black text-[#D32323]">{formatRupiah(selectedPo.totalAmount)}</span>
              </div>
            </div>

            {selectedPo.notes && (
              <p className="text-xs text-zinc-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <strong>Catatan PO:</strong> {selectedPo.notes}
              </p>
            )}

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-zinc-400 font-bold uppercase">
                    <th className="pb-2">Bahan Baku</th>
                    <th className="pb-2 text-right">Jumlah Dipesan</th>
                    <th className="pb-2 text-right">Harga Satuan</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {selectedPo.items.map((it) => (
                    <tr key={it.id} className="py-2">
                      <td className="py-2.5 font-bold text-zinc-900">{it.materialName}</td>
                      <td className="py-2.5 text-right font-black">{it.orderedQty} {it.unit}</td>
                      <td className="py-2.5 text-right text-zinc-600">{formatRupiah(it.unitCost)}</td>
                      <td className="py-2.5 text-right font-bold text-zinc-900">{formatRupiah(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={() => setSelectedPo(null)}
                className="text-zinc-600 text-xs font-bold hover:underline"
              >
                Kembali
              </button>

              {selectedPo.status !== "RECEIVED" && (
                <button
                  onClick={() => handleReceive(selectedPo.id)}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Konfirmasi Penerimaan Barang (Goods Receipt)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
