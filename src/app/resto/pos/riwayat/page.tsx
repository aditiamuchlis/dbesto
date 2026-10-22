"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import { Printer, Eye, Search } from "lucide-react";
import { PosOrder } from "@/lib/types";

export default function PosRiwayatPage() {
  const { posOrders, currentOutlet } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);

  const outletOrders = posOrders
    .filter((o) => o.outletId === currentOutlet.id)
    .filter(
      (o) =>
        o.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            DATA TRANSAKSI POS
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Riwayat Struk Penjualan</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong>{currentOutlet.name}</strong> • Total {outletOrders.length} transaksi tercatat
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor invoice / pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-4">No. Invoice</th>
                <th className="p-4">Waktu</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tipe Order</th>
                <th className="p-4">Total</th>
                <th className="p-4">Metode</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {outletOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400">
                    Belum ada transaksi di cabang ini.
                  </td>
                </tr>
              ) : (
                outletOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/70">
                    <td className="p-4 font-mono font-bold text-zinc-900">{ord.invoiceNumber}</td>
                    <td className="p-4 text-zinc-500">{formatTanggalIndo(ord.createdAt, true)}</td>
                    <td className="p-4 font-semibold text-zinc-800">{ord.customerName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-bold text-[10px]">
                        {ord.orderType}
                      </span>
                    </td>
                    <td className="p-4 font-black text-[#D32323]">{formatRupiah(ord.totalAmount)}</td>
                    <td className="p-4 font-semibold text-zinc-700">{ord.paymentMethod}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Struk Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-xs text-zinc-500">Detail Nota Struk</span>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 font-mono text-[11px] space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-zinc-300">
                <p className="font-black text-sm">D&apos;BESTO CHICKEN & BURGER</p>
                <p>{selectedOrder.outletName}</p>
                <p className="font-bold">{selectedOrder.invoiceNumber}</p>
              </div>

              <div className="space-y-1 border-b border-dashed border-zinc-300 pb-2">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 (10%):</span>
                  <span>{formatRupiah(selectedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-zinc-200 text-[#D32323]">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between font-normal text-zinc-500">
                  <span>Metode:</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Ulang Struk</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
