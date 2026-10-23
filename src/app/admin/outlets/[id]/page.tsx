"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { GeofenceRadiusMap } from "@/components/common/GeofenceRadiusMap";

interface PageProps {
  params: Promise<{ id: string }>;
}

function AdminOutletDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const { outlets, users, stocks, posOrders, rawMaterials } = useAppStore();

  const outlet = outlets.find((o) => o.id === resolvedParams.id) || outlets[0];

  // Outlet specific data
  const outletUsers = users.filter((u) => u.outletId === outlet.id);
  const outletOrders = posOrders.filter((o) => o.outletId === outlet.id);
  const outletStocks = stocks.filter((s) => s.outletId === outlet.id);

  const totalOmzet = outletOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const target = outlet.monthlyTarget || 100000000;
  const targetProgress = Math.min(100, Math.round((totalOmzet / target) * 100));

  const [activeTab, setActiveTab] = useState<"staf" | "stok" | "transaksi" | "geofence">("staf");
  const [testLat, setTestLat] = useState(outlet.latitude + 0.0001);
  const [testLng, setTestLng] = useState(outlet.longitude + 0.0001);

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/admin" className="hover:text-zinc-900 transition">
            Admin HQ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/admin/outlets" className="hover:text-zinc-900 transition">
            Master Cabang
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[#D32323] font-bold">{outlet.name}</span>
        </div>

        <Link
          href="/admin/outlets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Cabang</span>
        </Link>
      </div>

      {/* Main Outlet Header Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center font-black">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-[#D32323] bg-red-50 px-2 py-0.5 rounded-md">
                  {outlet.code}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Resto Aktif
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{outlet.name}</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {outlet.address} • Wilayah {outlet.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200 text-right">
              <span className="text-zinc-400 block text-[10px]">Koordinat Geofence:</span>
              <strong className="text-zinc-900">
                {outlet.latitude.toFixed(4)}, {outlet.longitude.toFixed(4)} ({outlet.radiusMeters}m)
              </strong>
            </div>
          </div>
        </div>

        {/* Target Progress Bar */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-700">Target Omzet Bulanan</span>
            <span className="font-black text-[#D32323]">
              {formatRupiah(totalOmzet)} / {formatRupiah(target)} ({targetProgress}%)
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-[#D32323] transition-all duration-500"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Total Omzet Kasir</span>
          <p className="text-2xl font-black text-[#D32323]">{formatRupiah(totalOmzet)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Penjualan cabang ini</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Tiket Transaksi POS</span>
          <p className="text-2xl font-black text-zinc-900">{outletOrders.length} Pesanan</p>
          <p className="text-[11px] text-zinc-500 mt-1">Total nota terbit</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Karyawan Terdaftar</span>
          <p className="text-2xl font-black text-zinc-900">{outletUsers.length} Orang</p>
          <p className="text-[11px] text-zinc-500 mt-1">Admin, Kasir, dan Staf</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Item Bahan Baku</span>
          <p className="text-2xl font-black text-emerald-600">{outletStocks.length} SKU</p>
          <p className="text-[11px] text-zinc-500 mt-1">Inventaris terdaftar</p>
        </div>
      </div>

      {/* Tab Navigations */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-zinc-200 px-6 pt-4 gap-4">
          <button
            onClick={() => setActiveTab("staf")}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "staf"
                ? "border-[#D32323] text-[#D32323]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Karyawan Cabang ({outletUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("stok")}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "stok"
                ? "border-[#D32323] text-[#D32323]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventaris Bahan Baku ({outletStocks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("transaksi")}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "transaksi"
                ? "border-[#D32323] text-[#D32323]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Tiket POS Cabang ({outletOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("geofence")}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "geofence"
                ? "border-[#D32323] text-[#D32323]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Radar Geofence ({outlet.radiusMeters}m)</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === "staf" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-extrabold uppercase">
                    <th className="pb-3">Nama Staf</th>
                    <th className="pb-3">Email Login</th>
                    <th className="pb-3">Role / Jabatan</th>
                    <th className="pb-3">No. Telepon</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {outletUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-zinc-400">
                        Belum ada staf yang diasosiasikan dengan cabang ini.
                      </td>
                    </tr>
                  ) : (
                    outletUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50 transition">
                        <td className="py-3 font-bold text-zinc-900">{u.name}</td>
                        <td className="py-3 text-zinc-600 font-mono">{u.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              u.role === "RESTO_ADMIN"
                                ? "bg-amber-100 text-amber-800"
                                : u.role === "CASHIER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-zinc-100 text-zinc-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-600">{u.phone || "-"}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "stok" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-extrabold uppercase">
                    <th className="pb-3">Kode & Nama Bahan</th>
                    <th className="pb-3">Stok Saat Ini</th>
                    <th className="pb-3">Satuan</th>
                    <th className="pb-3">Batas Minimum Alert</th>
                    <th className="pb-3">Status Kondisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {outletStocks.map((stk) => {
                    const minAlert = rawMaterials.find((m) => m.id === stk.materialId)?.minStockAlert || 10;
                    const isLow = stk.currentStock <= minAlert;
                    return (
                      <tr key={stk.id} className="hover:bg-zinc-50 transition">
                        <td className="py-3 font-bold text-zinc-900">{stk.materialName}</td>
                        <td className="py-3 font-black text-sm text-zinc-900">
                          {stk.currentStock}
                        </td>
                        <td className="py-3 text-zinc-500">{stk.unit}</td>
                        <td className="py-3 text-zinc-500 font-semibold">{minAlert} {stk.unit}</td>
                        <td className="py-3">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Stok Menipis!</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aman</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "transaksi" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-extrabold uppercase">
                    <th className="pb-3">No. Invoice</th>
                    <th className="pb-3">Waktu</th>
                    <th className="pb-3">Tipe</th>
                    <th className="pb-3">Pelanggan</th>
                    <th className="pb-3">Metode Bayar</th>
                    <th className="pb-3 text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {outletOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-zinc-400">
                        Belum ada riwayat transaksi POS di cabang ini.
                      </td>
                    </tr>
                  ) : (
                    outletOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50 transition">
                        <td className="py-3 font-mono font-bold text-zinc-900">{o.invoiceNumber}</td>
                        <td className="py-3 text-zinc-500">{formatTanggalIndo(o.createdAt, true)}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold text-[10px]">
                            {o.orderType}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-700">{o.customerName || "-"}</td>
                        <td className="py-3 font-semibold text-zinc-900">{o.paymentMethod}</td>
                        <td className="py-3 font-black text-right text-[#D32323]">
                          {formatRupiah(o.totalAmount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "geofence" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div>
                  <h4 className="text-sm font-black text-zinc-900">
                    Radar Geofence Kehadiran {outlet.name}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Staf hanya dapat melakukan Absensi & Selfie Kehadiran apabila berada dalam radius{" "}
                    <strong className="text-zinc-900">{outlet.radiusMeters} meter</strong> dari titik sentral cabang.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-500 bg-white px-3 py-1.5 rounded-xl border border-zinc-200">
                    Titik Pusat: {outlet.latitude.toFixed(6)}, {outlet.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <GeofenceRadiusMap
                centerLat={outlet.latitude}
                centerLng={outlet.longitude}
                radiusMeters={outlet.radiusMeters}
                outletName={outlet.name}
                userLat={testLat}
                userLng={testLng}
                onLocationChange={(lat, lng) => {
                  setTestLat(lat);
                  setTestLng(lng);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOutletDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500">
          Memuat data cabang...
        </div>
      }
    >
      <AdminOutletDetailContent {...props} />
    </Suspense>
  );
}
