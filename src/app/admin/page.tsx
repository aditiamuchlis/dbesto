"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Store,
  Truck,
  Users,
  ShoppingBag,
  Clock,
  ClipboardList,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Package,
  CalendarCheck,
  Receipt,
  UserCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const {
    currentUser,
    currentOutlet,
    outlets,
    posOrders,
    purchaseOrders,
    attendances,
    stocks,
    shifts,
  } = useAppStore();

  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>("all");
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  // Filtered orders for HQ Super Admin
  const filteredOrders =
    selectedOutletFilter === "all"
      ? posOrders
      : posOrders.filter((o) => o.outletId === selectedOutletFilter);

  const totalOmzet = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransactions = filteredOrders.length;
  const aov = totalTransactions > 0 ? Math.round(totalOmzet / totalTransactions) : 0;

  const pendingPos = purchaseOrders.filter((po) => po.status === "SUBMITTED").length;
  const totalPresentStaff = attendances.filter(
    (a) => a.status === "PRESENT" || a.status === "LATE"
  ).length;

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

  // Branch-specific data (for RESTO_ADMIN, CASHIER, STAFF)
  const branchOrders = posOrders.filter((o) => o.outletId === currentOutlet.id);
  const branchTodayOrders = branchOrders; // demo data
  const branchTodayOmzet = branchTodayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const branchStocks = stocks.filter((s) => s.outletId === currentOutlet.id);
  const criticalStocks = branchStocks.filter((s) => s.currentStock <= 30);
  const branchStaffPresent = attendances.filter(
    (a) => a.outletId === currentOutlet.id && (a.status === "PRESENT" || a.status === "LATE")
  ).length;

  // Cashier personal shift data
  const myShiftOrders = branchOrders.filter((o) => o.cashierId === currentUser.id);
  const myShiftOmzet = myShiftOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const myShiftCash = myShiftOrders
    .filter((o) => o.paymentMethod === "CASH")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const myShiftQris = myShiftOrders
    .filter((o) => o.paymentMethod === "QRIS")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Staff personal attendance
  const myAttendance = attendances.find((a) => a.userId === currentUser.id);

  // ==========================================
  // VIEW 1: SUPER_ADMIN (HQ COMMAND CENTER)
  // ==========================================
  if (currentUser.role === "SUPER_ADMIN") {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] bg-amber-500 text-zinc-950 font-black px-2 py-0.5 rounded-full uppercase">
                HQ SUPER ADMIN
              </span>
              <span className="text-xs text-zinc-500 font-bold">KANTOR PUSAT</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Konsolidasi Jaringan Resto D&apos;Besto
            </h2>
            <p className="text-xs text-zinc-500">
              Selamat datang, <strong className="text-zinc-800">{currentUser.name}</strong>. Memantau seluruh cabang resto di Indonesia.
            </p>
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
                <option value="all">Semua Cabang ({outlets.length} Resto)</option>
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
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Total Omzet Global</span>
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

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Total Tiket POS</span>
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-zinc-900">{totalTransactions} Tiket</p>
            <p className="text-[11px] text-zinc-500">Rata-rata {formatRupiah(aov)} / order</p>
          </div>

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

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">PO Pending HQ</span>
              <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-orange-600">{pendingPos} Pengajuan</p>
            <Link href="/admin/laporan/po-bahan-baku" className="text-[11px] text-orange-600 font-bold hover:underline">
              Periksa & setujui &rarr;
            </Link>
          </div>

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

        {/* Branch Sales & Payments Share */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-zinc-900">Performa Omzet per Cabang Resto</h3>
              <span className="text-xs text-zinc-500">Target vs Realisasi</span>
            </div>

            <div className="space-y-4 pt-2">
              {outlets.map((outlet) => {
                const bOrders = posOrders.filter((o) => o.outletId === outlet.id);
                const bSales = bOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                const pct = outlet.monthlyTarget
                  ? Math.min(100, Math.round((bSales / outlet.monthlyTarget) * 100))
                  : 0;
                return (
                  <div key={outlet.id} className="space-y-1.5 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-900">{outlet.name}</span>
                        <span className="text-zinc-500 ml-2">({outlet.city})</span>
                      </div>
                      <span className="font-black text-[#D32323]">{formatRupiah(bSales)}</span>
                    </div>

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

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-base text-zinc-900">Metode Pembayaran</h3>
                <span className="text-xs text-zinc-500">Cash vs Digital</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-700">Tunai (Cash Laci)</span>
                    <span>
                      {formatRupiah(cashTotal)} ({cashPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cashPercent}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-blue-700">QRIS Dinamis</span>
                    <span>
                      {formatRupiah(qrisTotal)} ({qrisPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${qrisPercent}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-purple-700">Kartu Debit / EDC</span>
                    <span>
                      {formatRupiah(debitTotal)} ({debitPercent}%)
                    </span>
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
                mempercepat alur kasir dan mengurangi risiko selisih kas.
              </p>
            </div>
          </div>
        </div>

        {/* HQ Quick Operations Hub */}
        <div className="bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-white">Pusat Navigasi Operasional Resto</h3>
              <p className="text-xs text-zinc-400">
                Pilih modul resto untuk melakukan transaksi, audit stok, atau persetujuan logistik
              </p>
            </div>
            <span className="text-xs bg-red-600/30 text-red-400 font-bold px-3 py-1 rounded-full border border-red-500/30">
              Akses Penuh Super Admin
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <Link
              href="/resto/pos"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-red-500 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-[#D32323] group-hover:scale-110 transition flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">POS Kasir</span>
              <span className="text-[10px] text-zinc-400">Transaksi Kasir</span>
            </Link>

            <Link
              href="/resto/pos/shift"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Shift Kasir</span>
              <span className="text-[10px] text-zinc-400">Buka / Tutup Kas</span>
            </Link>

            <Link
              href="/resto/stock-opname"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-blue-500 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Stock Opname</span>
              <span className="text-[10px] text-zinc-400">Audit Fisik Bahan</span>
            </Link>

            <Link
              href="/resto/po-bahan-baku"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-purple-500 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">PO Bahan Baku</span>
              <span className="text-[10px] text-zinc-400">Pasokan Gudang</span>
            </Link>

            <Link
              href="/resto/absensi"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-emerald-500 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Absensi GPS</span>
              <span className="text-[10px] text-zinc-400">Presensi Radius</span>
            </Link>

            <Link
              href="/resto/laporan"
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Laporan Resto</span>
              <span className="text-[10px] text-zinc-400">Rekap Omzet Harian</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: RESTO_ADMIN (STORE MANAGER CABANG)
  // ==========================================
  if (currentUser.role === "RESTO_ADMIN") {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Branch Header Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-6 rounded-3xl border border-zinc-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  STORE MANAGER
                </span>
                <span className="text-xs text-zinc-400">Cabang Aktif</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Dashboard Operasional {currentOutlet.name}
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentOutlet.address}, {currentOutlet.city}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/resto/pos"
                className="bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Terminal Kasir</span>
              </Link>
              <Link
                href="/resto/laporan"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 transition"
              >
                Laporan Harian
              </Link>
            </div>
          </div>
        </div>

        {/* Branch KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Omzet Hari Ini</span>
              <span className="w-8 h-8 rounded-full bg-red-50 text-[#D32323] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-[#D32323]">{formatRupiah(branchTodayOmzet)}</p>
            <p className="text-[11px] text-zinc-500">{branchTodayOrders.length} transaksi kasir tercatat</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Status Shift Kasir</span>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${activeShift ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xl font-black ${activeShift ? "text-emerald-700" : "text-red-700"}`}>
              {activeShift ? "Shift Buka (Aktif)" : "Shift Belum Dibuka"}
            </p>
            <Link href="/resto/pos/shift" className="text-[11px] text-blue-600 font-bold hover:underline block">
              {activeShift ? "Lihat uang laci & tutup shift &rarr;" : "Buka shift sekarang &rarr;"}
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Stok Kritis Cabang</span>
              <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-amber-600">{criticalStocks.length} Bahan</p>
            <Link href="/resto/po-bahan-baku" className="text-[11px] text-amber-700 font-bold hover:underline block">
              Buat PO ke Gudang HQ &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Tim Hadir Hari Ini</span>
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-zinc-900">{branchStaffPresent} Karyawan</p>
            <Link href="/resto/absensi/riwayat" className="text-[11px] text-emerald-700 font-bold hover:underline block">
              Cek presensi GPS tim &rarr;
            </Link>
          </div>
        </div>

        {/* Quick Operational Launchpad */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-zinc-900">Modul Operasional Resto Cabang</h3>
            <span className="text-xs text-zinc-500">Tugas Harian Toko</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <Link
              href="/resto/pos"
              className="p-5 rounded-2xl bg-zinc-50 hover:bg-red-50/50 border border-zinc-200 hover:border-red-300 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D32323] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">Terminal POS Kasir</h4>
              <p className="text-xs text-zinc-500">Input order dine-in, takeaway, dan cetak struk kasir.</p>
            </Link>

            <Link
              href="/resto/stock-opname"
              className="p-5 rounded-2xl bg-zinc-50 hover:bg-blue-50/50 border border-zinc-200 hover:border-blue-300 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">Hitung Stock Opname</h4>
              <p className="text-xs text-zinc-500">Audit stok harian bahan baku, ayam, minyak, dan kemasan.</p>
            </Link>

            <Link
              href="/resto/po-bahan-baku"
              className="p-5 rounded-2xl bg-zinc-50 hover:bg-purple-50/50 border border-zinc-200 hover:border-purple-300 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">Request PO ke Gudang HQ</h4>
              <p className="text-xs text-zinc-500">Pesan pasokan bahan baku resmi langsung ke logistik pusat.</p>
            </Link>

            <Link
              href="/resto/absensi"
              className="p-5 rounded-2xl bg-zinc-50 hover:bg-emerald-50/50 border border-zinc-200 hover:border-emerald-300 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">Terminal Presensi GPS</h4>
              <p className="text-xs text-zinc-500">Verifikasi jam masuk & pulang karyawan dalam radius 100m.</p>
            </Link>
          </div>
        </div>

        {/* Recent Branch Orders Table */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-zinc-900">Transaksi Penjualan Terakhir</h3>
              <p className="text-xs text-zinc-500">Riwayat transaksi di {currentOutlet.name}</p>
            </div>
            <Link href="/resto/pos/riwayat" className="text-xs font-bold text-[#D32323] hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase font-black tracking-wider">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Tipe</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {branchTodayOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#D32323]">{o.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-zinc-700">{o.orderType}</td>
                    <td className="py-3 px-3 font-medium text-zinc-900">{o.customerName}</td>
                    <td className="py-3 px-3 font-bold text-zinc-900">{formatRupiah(o.totalAmount)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-zinc-100 text-zinc-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-500">{formatTanggalIndo(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CASHIER (KASIR OUTLET)
  // ==========================================
  if (currentUser.role === "CASHIER") {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Cashier Shift Hero Banner */}
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl border border-red-900/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#D32323] text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  KASIR BERTUGAS
                </span>
                <span className="text-xs text-zinc-300 font-bold">{currentOutlet.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Halo, {currentUser.name}!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                {activeShift
                  ? `Shift kasir Anda saat ini AKTIF. Modal awal kas tercatat Rp 300.000. Siap melayani pelanggan D'Besto!`
                  : `Shift kasir belum dibuka. Silakan buka shift dengan mengisi kas modal sebelum melakukan transaksi.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/resto/pos"
                className="bg-[#D32323] hover:bg-[#B31818] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-red-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buka Terminal POS Kasir</span>
              </Link>
              <Link
                href="/resto/pos/shift"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs px-4 py-3.5 rounded-2xl border border-zinc-700 transition text-center"
              >
                {activeShift ? "Tutup / Setor Kas Shift" : "Buka Shift Kasir"}
              </Link>
            </div>
          </div>
        </div>

        {/* Shift Cashier Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Total Penjualan Shift</span>
              <span className="w-8 h-8 rounded-full bg-red-50 text-[#D32323] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-[#D32323]">{formatRupiah(myShiftOmzet)}</p>
            <p className="text-[11px] text-zinc-500">{myShiftOrders.length} transaksi selesai</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Uang Tunai di Laci Kas</span>
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-700">{formatRupiah(myShiftCash + 300000)}</p>
            <p className="text-[11px] text-zinc-500">Termasuk kas modal Rp 300.000</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Pembayaran Non-Tunai</span>
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-blue-700">{formatRupiah(myShiftQris)}</p>
            <p className="text-[11px] text-zinc-500">QRIS & Kartu Debit langsung cloud</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Presensi GPS Kasir</span>
              <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </span>
            </div>
            <p className="text-lg font-black text-emerald-600">Presensi Valid</p>
            <Link href="/resto/absensi" className="text-[11px] text-blue-600 font-bold hover:underline block">
              Lihat detail kehadiran &rarr;
            </Link>
          </div>
        </div>

        {/* Quick Shift Receipts Table */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-zinc-900">Transaksi Terakhir di Kasir Anda</h3>
              <p className="text-xs text-zinc-500">Struk pesanan yang diproses pada shift ini</p>
            </div>
            <Link href="/resto/pos/riwayat" className="text-xs font-bold text-[#D32323] hover:underline">
              Lihat Riwayat Lengkap &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase font-black tracking-wider">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Total Belanja</th>
                  <th className="py-2.5 px-3">Metode Bayar</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {myShiftOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#D32323]">{o.invoiceNumber}</td>
                    <td className="py-3 px-3 font-medium text-zinc-900">{o.customerName}</td>
                    <td className="py-3 px-3 font-bold text-zinc-900">{formatRupiah(o.totalAmount)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-zinc-100 text-zinc-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Lunas
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/resto/pos?reprint=${o.invoiceNumber}`}
                        className="text-xs text-zinc-700 hover:text-[#D32323] font-bold border border-zinc-200 px-2.5 py-1 rounded-lg hover:bg-white"
                      >
                        Cetak Struk
                      </Link>
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

  // ==========================================
  // VIEW 4: STAFF (KITCHEN & DAPUR)
  // ==========================================
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Staff Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                STAFF KITCHEN & OPERASIONAL
              </span>
              <span className="text-xs text-zinc-400">{currentOutlet.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Selamat Bertugas, {currentUser.name}!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Pastikan Anda sudah melakukan presensi GPS sebelum mulai memasak dan selalu periksa kesiapan bahan baku ayam krispi D&apos;Besto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/resto/absensi"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-center"
            >
              <MapPin className="w-5 h-5" />
              <span>Terminal Presensi GPS</span>
            </Link>
            <Link
              href="/resto/stock-opname"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs px-4 py-3.5 rounded-2xl border border-zinc-700 transition text-center"
            >
              Input Hitung Stok
            </Link>
          </div>
        </div>
      </div>

      {/* Staff Task & Presensi Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase">
            <span>Status Kehadiran Hari Ini</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600">Hadir (Tepat Waktu)</p>
          <p className="text-xs text-zinc-500">Jam Masuk: 08:45 WIB • Radius 24m dari resto</p>
          <Link href="/resto/absensi/riwayat" className="text-xs font-bold text-emerald-700 hover:underline block pt-1">
            Lihat riwayat presensi bulan ini &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase">
            <span>Tugas Stock Opname Dapur</span>
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900">Perlu Hitung Fisik</p>
          <p className="text-xs text-zinc-500">Hitung stok ayam potong, tepung bumbu, dan minyak goreng</p>
          <Link href="/resto/stock-opname" className="text-xs font-bold text-blue-600 hover:underline block pt-1">
            Buka form hitung stok fisik &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase">
            <span>Standar Mutu Produk</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600">100% Halal & SOP</p>
          <p className="text-xs text-zinc-500">Suhu deep fryer 170°C, waktu penggorengan ayam 12-14 menit</p>
        </div>
      </div>

      {/* Staff Raw Materials Inventory Snapshot */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-zinc-900">Bahan Baku Utama di Dapur {currentOutlet.name}</h3>
            <p className="text-xs text-zinc-500">Pantauan stok fisik di cold storage dan kitchen cabinet</p>
          </div>
          <Link href="/resto/stock-opname" className="text-xs font-bold text-[#D32323] hover:underline">
            Mulai Hitung Stok &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {branchStocks.slice(0, 4).map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[10px] text-zinc-400 font-mono">KODE: {s.materialId}</span>
              <h4 className="font-bold text-xs text-zinc-900">{s.materialName}</h4>
              <p className="text-xl font-black text-zinc-900">{s.currentStock} {s.unit}</p>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Batas Min: 20 {s.unit}</span>
                <span className={`font-bold ${s.currentStock <= 30 ? "text-amber-600" : "text-emerald-600"}`}>
                  {s.currentStock <= 30 ? "Perlu Re-Stock" : "Aman"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
