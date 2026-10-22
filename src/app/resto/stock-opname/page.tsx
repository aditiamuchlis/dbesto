"use client";

import { useState } from "react";
import { ClipboardList, AlertCircle, CheckCircle2, TrendingDown, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";

export default function StockOpnamePage() {
  const {
    stocks,
    currentOutlet,
    currentUser,
    stockOpnames,
    submitStockOpname,
    approveStockOpname,
  } = useAppStore();

  const outletStocks = stocks.filter((s) => s.outletId === currentOutlet.id);

  // Form input state
  const [physicalValues, setPhysicalValues] = useState<{ [materialId: string]: number }>({});
  const [reasons, setReasons] = useState<{ [materialId: string]: string }>({});
  const [opnameNotes, setOpnameNotes] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handlePhysicalChange = (matId: string, val: number) => {
    setPhysicalValues((prev) => ({ ...prev, [matId]: val }));
  };

  const handleReasonChange = (matId: string, val: string) => {
    setReasons((prev) => ({ ...prev, [matId]: val }));
  };

  // Calculations
  const calculatedItems = outletStocks.map((stk) => {
    const phys =
      physicalValues[stk.materialId] !== undefined
        ? physicalValues[stk.materialId]
        : stk.currentStock;
    const diff = phys - stk.currentStock;
    const loss = diff < 0 ? Math.abs(diff) * stk.standardCost : 0;
    return {
      materialId: stk.materialId,
      materialName: stk.materialName,
      unit: stk.unit,
      systemStock: stk.currentStock,
      physicalStock: phys,
      difference: diff,
      costPerUnit: stk.standardCost,
      lossValue: loss,
      reason: reasons[stk.materialId] || "",
    };
  });

  const totalCalculatedLoss = calculatedItems.reduce((sum, item) => sum + item.lossValue, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = calculatedItems.map((it) => ({
      materialId: it.materialId,
      systemStock: it.systemStock,
      physicalStock: it.physicalStock,
      reason: it.reason || (it.difference === 0 ? "Sesuai" : "Selisih fisik"),
    }));

    const newOp = submitStockOpname(items, opnameNotes || "Stock opname rutin shift closing");
    setSubmittedMessage(`Stock Opname ${newOp.opnameNumber} berhasil diajukan!`);
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            AUDIT INVENTARIS
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Form Stock Opname Bahan Baku</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Petugas Input: <strong>{currentUser.name}</strong>
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Estimasi Nilai Selisih</span>
            <span className="text-base font-black text-[#D32323]">{formatRupiah(totalCalculatedLoss)}</span>
          </div>
        </div>
      </div>

      {submittedMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{submittedMessage}</p>
        </div>
      )}

      {/* FORM INPUT OPNAME */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <h3 className="font-extrabold text-sm text-zinc-900">Penghitungan Fisik Aktual Dapur & Gudang</h3>
          <span className="text-xs text-zinc-500">Bandingkan Stok Buku Sistem vs Hitungan Fisik Riil</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Bahan Baku</th>
                <th className="p-3.5">Satuan</th>
                <th className="p-3.5 text-center">Stok Sistem</th>
                <th className="p-3.5 text-center">Hitung Fisik</th>
                <th className="p-3.5 text-center">Selisih</th>
                <th className="p-3.5">Biaya/Unit</th>
                <th className="p-3.5">Potensi Rugi</th>
                <th className="p-3.5">Alasan Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {calculatedItems.map((item) => (
                <tr key={item.materialId} className="hover:bg-zinc-50/70">
                  <td className="p-3.5 font-bold text-zinc-900">{item.materialName}</td>
                  <td className="p-3.5 font-mono text-zinc-500">{item.unit}</td>
                  <td className="p-3.5 text-center font-bold text-zinc-700">{item.systemStock}</td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={item.physicalStock}
                      onChange={(e) => handlePhysicalChange(item.materialId, Number(e.target.value))}
                      className="w-20 text-center font-black p-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#D32323] bg-white"
                    />
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-md ${
                        item.difference === 0
                          ? "bg-zinc-100 text-zinc-600"
                          : item.difference < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.difference > 0 ? `+${item.difference}` : item.difference} {item.unit}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-600">{formatRupiah(item.costPerUnit)}</td>
                  <td className="p-3.5 font-bold text-red-600">
                    {item.lossValue > 0 ? formatRupiah(item.lossValue) : "-"}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={item.reason}
                      onChange={(e) => handleReasonChange(item.materialId, e.target.value)}
                      className="text-xs p-1.5 rounded-lg border border-zinc-300 bg-white focus:outline-none"
                    >
                      <option value="Sesuai">Sesuai / Tanpa Selisih</option>
                      <option value="Susut pencairan & trimming">Susut pencairan & trimming</option>
                      <option value="Basi / Rusak">Basi / Rusak</option>
                      <option value="Tumpah saat masak">Tumpah saat masak</option>
                      <option value="Salah catat transaksi">Salah catat transaksi</option>
                      <option value="Selisih fisik gudang">Selisih fisik gudang</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Catatan tambahan hasil opname shift..."
            value={opnameNotes}
            onChange={(e) => setOpnameNotes(e.target.value)}
            className="flex-1 min-w-[280px] text-xs p-3 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:border-[#D32323]"
          />
          <button
            type="submit"
            className="bg-[#D32323] hover:bg-[#B31818] text-white font-black px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
          >
            Ajukan Stock Opname Cabang
          </button>
        </div>
      </form>

      {/* RIWAYAT OPNAME */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-black text-base text-zinc-900">Riwayat Stock Opname Cabang Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">No. Dokumen</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Penginput</th>
                <th className="p-3.5">Total Nilai Selisih</th>
                <th className="p-3.5">Catatan</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {stockOpnames
                .filter((o) => o.outletId === currentOutlet.id)
                .map((op) => (
                  <tr key={op.id} className="hover:bg-zinc-50/70">
                    <td className="p-3.5 font-mono font-bold text-zinc-900">{op.opnameNumber}</td>
                    <td className="p-3.5">{formatTanggalIndo(op.opnameDate, true)}</td>
                    <td className="p-3.5 font-semibold text-zinc-700">{op.createdByName}</td>
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
                      {op.status === "SUBMITTED" && currentUser.role !== "STAFF" && (
                        <button
                          onClick={() => approveStockOpname(op.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs cursor-pointer"
                        >
                          Approve Opname
                        </button>
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
