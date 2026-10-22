"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Store,
  Truck,
  Users,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const { outlets, posOrders, purchaseOrders, attendances, products } = useAppStore();
  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>("all");
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");

  const filteredOrders =
    selectedOutletFilter === "all"
      ? posOrders
      : posOrders.filter((o) => o.outletId === selectedOutletFilter);

  const totalOmzet = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransactions = filteredOrders.length;
  const aov = totalTransactions > 0 ? Math.round(totalOmzet / totalTransactions) : 0;

  const pendingPos = purchaseOrders.filter((po) => po.status === "SUBMITTED").length;
  const totalPresentStaff = attendances.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;

  // Payment Breakdown
  const cashTotal = filteredOrders
    .filter((o) => o.paymentMethod === "CASH")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const qrisTotal = filteredOrders
    .filter((o) => o.paymentMethod === "QRIS")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const debitTotal = filteredOrders
    .filter((o) => o.paymentMethod === "DEBIT_CARD")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const cashPercent = totalOmzet > 0 ? Math.round((cashTotal / totalOmzet) * 100) : 0;
  const qrisPercent = totalOmzet > 0 ? Math.round((qrisTotal / totalOmzet) * 100) : 0;
  const debitPercent = totalOmzet > 0 ? Math.round((debitTotal / totalOmzet) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            EXECUTIVE DASHBOARD
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Ikhtisar Omzet & Performa Jaringan Resto
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Outlet Filter Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs">
            <Store className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedOutletFilter}
              onChange={(e) => setSelectedOutletFilter(e.target.value)}
              className="bg-transparent font-bold text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Cabang (Konsolidasi)</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-bold text-zinc-600">
            <button
              onClick={() => setPeriod("today")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === "today" ? "bg-white text-zinc-900 shadow-xs" : ""
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === "week" ? "bg-white text-zinc-900 shadow-xs" : ""
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === "month" ? "bg-white text-zinc-900 shadow-xs" : ""
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Total Omzet</span>
            <span className="w-8 h-8 rounded-full bg-red-50 text-[#D32323] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-[#D32323]">{formatRupiah(totalOmzet)}</p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs bulan lalu</span>
          </p>
        </div>

        {/* Total Transaksi */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Total Transaksi</span>
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{totalTransactions} Tiket</p>
          <p className="text-[11px] text-zinc-500">Rata-rata {formatRupiah(aov)} / order</p>
        </div>

        {/* Cabang Aktif */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Cabang Resto</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{outlets.length} Resto</p>
          <p className="text-[11px] text-emerald-600 font-bold">100% Operasional Buka</p>
        </div>

        {/* PO Pending HQ */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-bold uppercase tracking-wider">PO Pending HQ</span>
            <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-orange-600">{pendingPos} Pengajuan</p>
          <p className="text-[11px] text-zinc-500">Menunggu approval pusat</p>
        </div>

        {/* Kehadiran Staf */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Staf Hadir Hari Ini</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{totalPresentStaff} Karyawan</p>
          <p className="text-[11px] text-emerald-600 font-bold">Presensi valid geofence</p>
        </div>
      </div>

      {/* Visual Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outlet Performance Comparison */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-zinc-900">Performa Omzet per Cabang Resto</h3>
            <span className="text-xs text-zinc-500">Target vs Realisasi</span>
          </div>

          <div className="space-y-4 pt-2">
            {outlets.map((outlet) => {
              const branchOrders = posOrders.filter((o) => o.outletId === outlet.id);
              const branchSales = branchOrders.reduce((sum, o) => sum + o.totalAmount, 0);
              const pct = outlet.monthlyTarget ? Math.min(100, Math.round((branchSales / outlet.monthlyTarget) * 100)) : 0;
              return (
                <div key={outlet.id} className="space-y-1.5 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-zinc-900">{outlet.name}</span>
                      <span className="text-zinc-500 ml-2">({outlet.city})</span>
                    </div>
                    <span className="font-black text-[#D32323]">{formatRupiah(branchSales)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-[#D32323] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, pct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Target: {formatRupiah(outlet.monthlyTarget)}</span>
                    <span className="font-bold text-zinc-700">{pct}% tercapai</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Share */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-zinc-900">Metode Pembayaran</h3>
              <span className="text-xs text-zinc-500">Cash vs Digital</span>
            </div>

            <div className="space-y-3">
              {/* Cash */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-700">Tunai (Cash Laci)</span>
                  <span>{formatRupiah(cashTotal)} ({cashPercent}%)</span>
                </div>
                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cashPercent}%` }} />
                </div>
              </div>

              {/* QRIS */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-700">QRIS Dinamis</span>
                  <span>{formatRupiah(qrisTotal)} ({qrisPercent}%)</span>
                </div>
                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${qrisPercent}%` }} />
                </div>
              </div>

              {/* Debit */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-purple-700">Kartu Debit / EDC</span>
                  <span>{formatRupiah(debitTotal)} ({debitPercent}%)</span>
                </div>
                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${debitPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <p>
              Transaksi digital (QRIS & Kartu) menyumbang {qrisPercent + debitPercent}% dari total omzet,
              mempercepat waktu antrean di kasir hingga 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
