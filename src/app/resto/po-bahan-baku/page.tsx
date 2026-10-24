"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, Plus, CheckCircle2, Clock, PackageCheck, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { PurchaseOrder } from "@/lib/types";

export default function PoBahanBakuPage() {
  const {
    rawMaterials,
    currentOutlet,
    currentUser,
    purchaseOrders,
    createPurchaseOrder,
    updatePoStatus,
  } = useAppStore();

  const [orderItems, setOrderItems] = useState<{ materialId: string; orderedQty: number }[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initial row when rawMaterials are available
  useEffect(() => {
    if (orderItems.length === 0 && rawMaterials.length > 0) {
      setOrderItems([{ materialId: rawMaterials[0].id, orderedQty: 20 }]);
    }
  }, [rawMaterials]);

  // Goods receipt modal state
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null);
  const [receivedNotes, setReceivedNotes] = useState("Barang tiba lengkap dan kemasan tersegel baik");
  const [receiptPhoto, setReceiptPhoto] = useState("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop");

  const outletPos = purchaseOrders.filter((po) => po.outletId === currentOutlet.id);

  const addItemRow = () => {
    if (rawMaterials.length === 0) return;
    setOrderItems((prev) => [...prev, { materialId: rawMaterials[0].id, orderedQty: 10 }]);
  };

  const removeItemRow = (idx: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: "materialId" | "orderedQty", val: any) => {
    setOrderItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleSubmitPo = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0 || rawMaterials.length === 0) return;

    const newPo = createPurchaseOrder(orderItems, deliveryDate, poNotes || "Pengajuan pasokan mingguan");
    setSuccessMsg(`PO ${newPo.poNumber} berhasil diajukan ke Gudang Pusat!`);
    if (rawMaterials.length > 0) {
      setOrderItems([{ materialId: rawMaterials[0].id, orderedQty: 20 }]);
    }
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleConfirmGoodsReceipt = () => {
    if (!receivingPo) return;
    updatePoStatus(receivingPo.id, "RECEIVED", receiptPhoto, receivedNotes);
    setReceivingPo(null);
    setSuccessMsg(`Konfirmasi Penerimaan PO ${receivingPo.poNumber} berhasil! Stok cabang telah bertambah otomatis.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            PENGADAAN BAHAN BAKU RESTO
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Purchase Order (PO) ke Gudang Pusat</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • PIC Pengajuan: <strong>{currentUser.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/resto/po-bahan-baku/riwayat"
            className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Lihat Riwayat & Penerimaan →</span>
          </Link>

          <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Pasokan HQ</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      )}

      {/* FORM BUAT PO */}
      <form onSubmit={handleSubmitPo} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <h3 className="font-extrabold text-sm text-zinc-900">Buat Formulir Pengajuan PO Baru</h3>
          <span className="text-xs text-zinc-500">Pilih bahan baku dan kuantitas pasokan</span>
        </div>

        <div className="p-5 space-y-4">
          {rawMaterials.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-700">Belum Ada Master Bahan Baku</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                Master bahan baku belum ditambahkan ke sistem. Super Admin perlu mendaftarkan bahan baku terlebih dahulu di menu Master Bahan Baku.
              </p>
              <Link
                href="/admin/master/bahan-baku"
                className="inline-block mt-3 text-xs font-bold text-[#D32323] hover:underline"
              >
                Ke Master Bahan Baku →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item, idx) => {
                const selectedMat = rawMaterials.find((m) => m.id === item.materialId);
                return (
                  <div key={idx} className="flex flex-wrap items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex-1 min-w-[240px]">
                      <label className="text-[11px] font-bold text-zinc-500 block mb-1">Bahan Baku:</label>
                      <select
                        value={item.materialId}
                        onChange={(e) => handleItemChange(idx, "materialId", e.target.value)}
                        className="w-full text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white"
                      >
                        {rawMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.unit}) — Acuan {formatRupiah(m.standardCost)}/{m.unit}
                          </option>
                        ))}
                      </select>
                    </div>

                  <div className="w-32">
                    <label className="text-[11px] font-bold text-zinc-500 block mb-1">
                      Jumlah ({selectedMat?.unit}):
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.orderedQty}
                      onChange={(e) => handleItemChange(idx, "orderedQty", Number(e.target.value))}
                      className="w-full text-xs font-black p-2.5 rounded-xl border border-zinc-300 bg-white"
                    />
                  </div>

                  <div className="w-36 text-right">
                    <label className="text-[11px] font-bold text-zinc-500 block mb-1">Estimasi Subtotal:</label>
                    <span className="text-xs font-black text-[#D32323]">
                      {formatRupiah((selectedMat?.standardCost || 0) * item.orderedQty)}
                    </span>
                  </div>

                  {orderItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 mt-4"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

          {rawMaterials.length > 0 && (
            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D32323] hover:text-[#B31818] bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Baris Bahan Baku</span>
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Target Tanggal Tiba (Delivery Date):
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Catatan PO:</label>
              <input
                type="text"
                placeholder="Contoh: Stok menipis jelang akhir pekan"
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="p-5 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            className="bg-[#D32323] hover:bg-[#B31818] text-white font-black px-8 py-3.5 rounded-xl shadow-md transition cursor-pointer"
          >
            Kirim Pengajuan PO ke Gudang Pusat
          </button>
        </div>
      </form>

      {/* DAFTAR RIWAYAT PO CABANG */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-black text-base text-zinc-900">Riwayat Pengajuan PO Bahan Baku</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">No. PO</th>
                <th className="p-3.5">Tanggal Order</th>
                <th className="p-3.5">Total Estimasi</th>
                <th className="p-3.5">Item Barang</th>
                <th className="p-3.5">Status Pengadaan</th>
                <th className="p-3.5 text-center">Aksi / Penerimaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {outletPos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">
                    Belum ada riwayat pengajuan PO untuk cabang ini.
                  </td>
                </tr>
              ) : (
                outletPos.map((po) => (
                  <tr key={po.id} className="hover:bg-zinc-50/70">
                  <td className="p-3.5 font-mono font-bold text-zinc-900">{po.poNumber}</td>
                  <td className="p-3.5">{formatTanggalIndo(po.orderDate, true)}</td>
                  <td className="p-3.5 font-black text-[#D32323]">{formatRupiah(po.totalAmount)}</td>
                  <td className="p-3.5">
                    <span className="font-medium text-zinc-700">
                      {po.items.map((i) => `${i.materialName} (${i.orderedQty} ${i.unit})`).join(", ")}
                    </span>
                  </td>
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
                    {(po.status === "APPROVED_BY_HQ" || po.status === "IN_DELIVERY") && (
                      <button
                        onClick={() => setReceivingPo(po)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Konfirmasi Diterima (GR)</span>
                      </button>
                    )}
                    {po.status === "SUBMITTED" && (
                      <button
                        onClick={() => updatePoStatus(po.id, "IN_DELIVERY")}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        Simulasikan Truk Kirim
                      </button>
                    )}
                    {po.status === "RECEIVED" && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Stok Bertambah</span>
                      </span>
                    )}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PENERIMAAN BARANG (GOODS RECEIPT) */}
      {receivingPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-black text-sm text-zinc-900">Konfirmasi Penerimaan Barang (Goods Receipt)</h4>
              <button onClick={() => setReceivingPo(null)} className="p-1 text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <p className="text-xs text-zinc-600">
              Barang dari Gudang Pusat untuk PO <strong className="font-mono">{receivingPo.poNumber}</strong> telah tiba di cabang.
            </p>

            <div className="space-y-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs">
              <p className="font-bold text-zinc-700">Checklist Kuantitas:</p>
              {receivingPo.items.map((it) => (
                <div key={it.id} className="flex justify-between text-zinc-600">
                  <span>{it.materialName}</span>
                  <span className="font-bold text-emerald-600">{it.orderedQty} {it.unit} (OK)</span>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Catatan Kondisi Barang:</label>
              <input
                type="text"
                value={receivedNotes}
                onChange={(e) => setReceivedNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-100 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-200">
                <Image src={receiptPhoto} alt="Surat Jalan" fill className="object-cover" unoptimized />
              </div>
              <div className="text-[11px] text-zinc-600">
                <p className="font-bold">Bukti Foto Surat Jalan Terlampir</p>
                <p className="text-[10px] text-zinc-500">Tersertifikasi verifikasi gudang</p>
              </div>
            </div>

            <button
              onClick={handleConfirmGoodsReceipt}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition cursor-pointer"
            >
              Konfirmasi & Masukkan ke Stok Cabang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
