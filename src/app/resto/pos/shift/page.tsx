"use client";

import { useState } from "react";
import { Clock, Banknote, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";

export default function ShiftPage() {
  const { currentOutlet, currentUser, shifts, openShift, closeShift } = useAppStore();

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  const [openingFloat, setOpeningFloat] = useState<number>(300000);
  const [openingNotes, setOpeningNotes] = useState("");

  const [closingCashCount, setClosingCashCount] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState("");

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(openingFloat, openingNotes || "Shift Pagi Kasir 1");
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    closeShift(activeShift.id, closingCashCount, closingNotes || "Tutup shift berjalan");
  };

  const expectedCash = activeShift ? (activeShift.expectedCash || activeShift.openingCash) : 0;
  const discrepancy = closingCashCount - expectedCash;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            MANAJEMEN KAS KASIR
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Rekonsiliasi Shift Kasir</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Kasir Bertugas: <strong>{currentUser.name}</strong>
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs ${
            activeShift
              ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
              : "bg-red-50 text-red-700 border border-red-300"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${activeShift ? "bg-emerald-500 animate-ping" : "bg-red-500"}`} />
          <span>{activeShift ? "STATUS: SHIFT SEDANG BUKA" : "STATUS: SHIFT DITUTUP"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OPEN SHIFT CARD */}
        {!activeShift ? (
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900">Buka Shift Baru (Open Shift)</h3>
                <p className="text-xs text-zinc-500">Input modal awal uang kas di laci (Cash Float)</p>
              </div>
            </div>

            <form onSubmit={handleOpen} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Modal Kas Awal (Opening Cash Float):
                </label>
                <input
                  type="number"
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(Number(e.target.value))}
                  required
                  min={0}
                  className="w-full text-xl font-black text-zinc-900 p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Catatan Shift:</label>
                <input
                  type="text"
                  placeholder="Contoh: Shift Pagi Kasir 1"
                  value={openingNotes}
                  onChange={(e) => setOpeningNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Konfirmasi Buka Shift Kasir
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-zinc-900">Ringkasan Shift Aktif</h3>
            <div className="space-y-2 text-xs text-zinc-600 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div className="flex justify-between">
                <span>Dibuka Sejak:</span>
                <span className="font-semibold text-zinc-900">{formatTanggalIndo(activeShift.openedAt, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kas Awal:</span>
                <span className="font-bold text-zinc-900">{formatRupiah(activeShift.openingCash)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Transaksi:</span>
                <span className="font-bold text-zinc-900">{activeShift.totalTransactions || 0} struk</span>
              </div>
              <div className="flex justify-between">
                <span>Penjualan Tunai:</span>
                <span className="font-bold text-emerald-700">{formatRupiah(activeShift.totalCashSales || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Penjualan Non-Tunai (QRIS/Debit):</span>
                <span className="font-bold text-blue-700">{formatRupiah(activeShift.totalNonCashSales || 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Ekspektasi Uang Fisik di Laci:</span>
                <span className="text-[#D32323]">{formatRupiah(expectedCash)}</span>
              </div>
            </div>
          </div>
        )}

        {/* CLOSE SHIFT CARD */}
        {activeShift && (
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900">Tutup Shift (Close Shift)</h3>
                <p className="text-xs text-zinc-500">Hitung fisik uang tunai di laci kasir</p>
              </div>
            </div>

            <form onSubmit={handleClose} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Hitungan Uang Fisik Aktual di Laci (Closing Cash Count):
                </label>
                <input
                  type="number"
                  value={closingCashCount || ""}
                  onChange={(e) => setClosingCashCount(Number(e.target.value))}
                  required
                  placeholder="0"
                  className="w-full text-xl font-black text-zinc-900 p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              {/* Live discrepancy indicator */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  discrepancy === 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : discrepancy < 0
                    ? "bg-red-50 text-red-700 border-red-300"
                    : "bg-blue-50 text-blue-700 border-blue-300"
                }`}
              >
                <span>Selisih Kas (Discrepancy):</span>
                <span>
                  {discrepancy === 0
                    ? "Pas / Sesuai (Rp 0)"
                    : discrepancy < 0
                    ? `Selisih Kurang ${formatRupiah(Math.abs(discrepancy))}`
                    : `Selisih Lebih ${formatRupiah(discrepancy)}`}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Catatan Penutupan / Alasan Selisih:</label>
                <input
                  type="text"
                  placeholder="Contoh: Selisih uang receh kembalian"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-black py-3.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Konfirmasi Tutup Shift Kasir
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SHIFT HISTORY TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-black text-base text-zinc-900">Riwayat Shift Kasir Cabang</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3">Waktu Buka</th>
                <th className="p-3">Waktu Tutup</th>
                <th className="p-3">Kasir</th>
                <th className="p-3">Kas Awal</th>
                <th className="p-3">Ekspektasi</th>
                <th className="p-3">Fisik Kas</th>
                <th className="p-3">Selisih</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {shifts
                .filter((s) => s.outletId === currentOutlet.id)
                .map((shift) => (
                  <tr key={shift.id} className="hover:bg-zinc-50/70">
                    <td className="p-3 font-medium">{formatTanggalIndo(shift.openedAt, true)}</td>
                    <td className="p-3">{shift.closedAt ? formatTanggalIndo(shift.closedAt, true) : "-"}</td>
                    <td className="p-3 font-semibold">{shift.userName}</td>
                    <td className="p-3">{formatRupiah(shift.openingCash)}</td>
                    <td className="p-3">{shift.expectedCash ? formatRupiah(shift.expectedCash) : "-"}</td>
                    <td className="p-3">{shift.closingCash ? formatRupiah(shift.closingCash) : "-"}</td>
                    <td className="p-3 font-bold">
                      {shift.cashDiscrepancy !== undefined ? (
                        <span className={shift.cashDiscrepancy < 0 ? "text-red-600" : "text-emerald-600"}>
                          {formatRupiah(shift.cashDiscrepancy)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          shift.status === "OPEN"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {shift.status}
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
