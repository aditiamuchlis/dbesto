"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  DollarSign,
  ShoppingCart,
  ClipboardList,
  Truck,
  MapPin,
  Package,
  UtensilsCrossed,
  ArrowLeft,
  ShieldCheck,
  Tag,
  Newspaper,
  Handshake,
  Settings,
  Clock,
  LogOut,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currentUser,
    currentOutlet,
    switchUser,
    switchOutlet,
    users,
    outlets,
    shifts,
  } = useAppStore();

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  // Dynamic Navigation filtered strictly by role
  const getNavigationForRole = () => {
    if (currentUser.role === "SUPER_ADMIN") {
      return [
        {
          group: "DASHBOARD HQ",
          items: [
            { label: "Dashboard Eksekutif HQ", href: "/admin", icon: LayoutDashboard },
            { label: "Master Cabang Resto", href: "/admin/outlets", icon: Store },
            { label: "Master Akun Staf & Role", href: "/admin/users", icon: Users },
          ],
        },
        {
          group: "OPERASIONAL RESTO CABANG",
          items: [
            { label: "POS Kasir (Point of Sale)", href: "/resto/pos", icon: ShoppingBag },
            { label: "Buka / Tutup Shift Kasir", href: "/resto/pos/shift", icon: Clock },
            { label: "Riwayat Transaksi Kasir", href: "/resto/pos/riwayat", icon: ShoppingCart },
            { label: "Stock Opname Cabang", href: "/resto/stock-opname", icon: ClipboardList },
            { label: "Riwayat Stock Opname", href: "/resto/stock-opname/riwayat", icon: ClipboardList },
            { label: "PO Bahan Baku Cabang", href: "/resto/po-bahan-baku", icon: Truck },
            { label: "Riwayat PO Bahan Baku", href: "/resto/po-bahan-baku/riwayat", icon: Truck },
            { label: "Terminal Absensi GPS", href: "/resto/absensi", icon: MapPin },
            { label: "Riwayat Absensi Karyawan", href: "/resto/absensi/riwayat", icon: CalendarCheck },
            { label: "Laporan Harian Resto", href: "/resto/laporan", icon: DollarSign },
          ],
        },
        {
          group: "AUDIT & LAPORAN HQ",
          items: [
            { label: "Laporan Pendapatan Global", href: "/admin/laporan/pemasukan", icon: DollarSign },
            { label: "Laporan Tiket POS Jaringan", href: "/admin/laporan/pos", icon: ShoppingCart },
            { label: "Audit Stock Opname Seluruh Resto", href: "/admin/laporan/stock-opname", icon: ClipboardList },
            { label: "Approval PO Bahan Gudang HQ", href: "/admin/laporan/po-bahan-baku", icon: Truck },
            { label: "Audit Absensi GPS Seluruh Staf", href: "/admin/laporan/absensi", icon: MapPin },
          ],
        },
        {
          group: "MASTER CMS & INVENTARIS",
          items: [
            { label: "Master Bahan Baku", href: "/admin/master/bahan-baku", icon: Package },
            { label: "Katalog Menu & Resep", href: "/admin/menu", icon: UtensilsCrossed },
            { label: "Manajemen Promo & Diskon", href: "/admin/promo", icon: Tag },
            { label: "Artikel & Berita Resmi", href: "/admin/berita", icon: Newspaper },
            { label: "Kemitraan Franchise", href: "/admin/kemitraan", icon: Handshake },
            { label: "Pengaturan Sistem HQ", href: "/admin/pengaturan", icon: Settings },
          ],
        },
      ];
    }

    if (currentUser.role === "RESTO_ADMIN") {
      return [
        {
          group: "DASHBOARD CABANG",
          items: [
            { label: `Dashboard ${currentOutlet.name}`, href: "/admin", icon: LayoutDashboard },
          ],
        },
        {
          group: "OPERASIONAL RESTO",
          items: [
            { label: "POS Kasir (Point of Sale)", href: "/resto/pos", icon: ShoppingBag },
            { label: "Buka / Tutup Shift Kasir", href: "/resto/pos/shift", icon: Clock },
            { label: "Riwayat Transaksi Penjualan", href: "/resto/pos/riwayat", icon: ShoppingCart },
            { label: "Stock Opname Cabang", href: "/resto/stock-opname", icon: ClipboardList },
            { label: "Riwayat Stock Opname", href: "/resto/stock-opname/riwayat", icon: ClipboardList },
            { label: "Request PO Bahan Baku", href: "/resto/po-bahan-baku", icon: Truck },
            { label: "Riwayat PO Bahan Baku", href: "/resto/po-bahan-baku/riwayat", icon: Truck },
            { label: "Terminal Absensi GPS", href: "/resto/absensi", icon: MapPin },
            { label: "Riwayat Absensi Tim Resto", href: "/resto/absensi/riwayat", icon: CalendarCheck },
          ],
        },
        {
          group: "LAPORAN RESTO CABANG",
          items: [
            { label: "Laporan Harian Omzet", href: "/resto/laporan", icon: DollarSign },
            { label: "Rekap Tiket POS Kasir", href: "/admin/laporan/pos", icon: ShoppingCart },
            { label: "Audit Stok Bahan Cabang", href: "/admin/laporan/stock-opname", icon: ClipboardList },
          ],
        },
      ];
    }

    if (currentUser.role === "CASHIER") {
      return [
        {
          group: "DASHBOARD KASIR",
          items: [
            { label: "Ringkasan Kas & Shift", href: "/admin", icon: LayoutDashboard },
          ],
        },
        {
          group: "TERMINAL KASIR (POS)",
          items: [
            { label: "Buka Terminal POS Kasir", href: "/resto/pos", icon: ShoppingBag },
            { label: "Buka / Tutup Shift Kasir", href: "/resto/pos/shift", icon: Clock },
            { label: "Riwayat Transaksi Shift Ini", href: "/resto/pos/riwayat", icon: ShoppingCart },
          ],
        },
        {
          group: "PRESENSI STAF",
          items: [
            { label: "Presensi GPS Masuk/Pulang", href: "/resto/absensi", icon: MapPin },
            { label: "Riwayat Presensi Saya", href: "/resto/absensi/riwayat", icon: CalendarCheck },
          ],
        },
      ];
    }

    // Default: STAFF (Kitchen & Operational)
    return [
      {
        group: "DASHBOARD KARYAWAN",
        items: [
          { label: "Ringkasan Tugas & Absen", href: "/admin", icon: LayoutDashboard },
        ],
      },
      {
        group: "KEHADIRAN & ABSENSI",
        items: [
          { label: "Terminal Absensi GPS", href: "/resto/absensi", icon: MapPin },
          { label: "Riwayat Kehadiran Pribadi", href: "/resto/absensi/riwayat", icon: CalendarCheck },
        ],
      },
      {
        group: "OPERASIONAL DAPUR & STOK",
        items: [
          { label: "Hitung Stock Opname Dapur", href: "/resto/stock-opname", icon: ClipboardList },
          { label: "Riwayat Hitung Bahan Baku", href: "/resto/stock-opname/riwayat", icon: ClipboardList },
        ],
      },
    ];
  };

  const navSections = getNavigationForRole();

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-amber-500 text-zinc-950 font-black";
      case "RESTO_ADMIN":
        return "bg-blue-600 text-white font-black";
      case "CASHIER":
        return "bg-[#D32323] text-white font-black";
      case "STAFF":
      default:
        return "bg-emerald-600 text-white font-black";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 text-zinc-300 flex flex-col border-r border-zinc-800 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-24 transition group-hover:scale-105">
              <Image
                src="/images/logo/dbesto-logo.png"
                alt="D'Besto"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${getRoleBadgeStyle(currentUser.role)}`}>
            {currentUser.role.replace("_", " ")}
          </span>
        </div>

        {/* User Context & Role Switch Card */}
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center font-black text-xs border border-zinc-700">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
              <p className="text-[10px] text-zinc-400 font-mono">
                {currentUser.outletName || currentOutlet.name}
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Inside Sidebar */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1">
              <UserCheck className="w-3 h-3 text-red-400" />
              <span>Ganti Akun Demo:</span>
            </div>
            <select
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 border border-zinc-700 focus:outline-none focus:border-red-400 cursor-pointer font-medium"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} [{u.role}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-3 block mb-2">
                {sec.group}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {currentUser.role !== "STAFF" ? (
            <Link
              href="/resto/pos"
              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#D32323] hover:bg-[#B31818] px-3 py-2.5 rounded-xl shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Masuk Terminal POS Kasir</span>
            </Link>
          ) : (
            <Link
              href="/resto/absensi"
              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2.5 rounded-xl shadow-md transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Terminal Absensi GPS</span>
            </Link>
          )}

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>

            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Akun</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar (Relocated from QuickPortalBanner) */}
        <header className="bg-zinc-900 text-zinc-200 border-b border-zinc-800 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title / Role header */}
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                  <span>
                    {currentUser.role === "SUPER_ADMIN"
                      ? "HQ COMMAND CENTER (PUSAT)"
                      : currentUser.role === "RESTO_ADMIN"
                      ? `PORTAL MANAJER — ${currentOutlet.name}`
                      : currentUser.role === "CASHIER"
                      ? `TERMINAL KASIR — ${currentOutlet.name}`
                      : `PORTAL KARYAWAN — ${currentOutlet.name}`}
                  </span>
                </h1>
                <p className="text-[10px] text-zinc-400">
                  D&apos;Besto Enterprise Cloud • Terhubung Online
                </p>
              </div>
            </div>

            {/* Controls: Cabang Selector, Role Switcher, Shortcuts, Status */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Outlet / Branch Selector */}
              <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-zinc-400 text-[11px] hidden sm:inline">Cabang:</span>
                <select
                  value={currentOutlet.id}
                  onChange={(e) => switchOutlet(e.target.value)}
                  className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id} className="bg-zinc-900 text-white">
                      {o.name} ({o.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Operational Module Shortcuts (From previous top bar) */}
              <div className="hidden lg:flex items-center gap-1.5">
                {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "RESTO_ADMIN" || currentUser.role === "CASHIER") && (
                  <Link
                    href="/resto/pos"
                    className="flex items-center gap-1 bg-[#D32323] hover:bg-red-700 text-white font-bold px-2.5 py-1.5 rounded-lg transition shadow-xs text-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>POS Kasir</span>
                  </Link>
                )}

                {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "RESTO_ADMIN" || currentUser.role === "CASHIER") && (
                  <Link
                    href="/resto/pos/shift"
                    className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition text-xs font-semibold"
                  >
                    Shift Kasir
                  </Link>
                )}

                {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "RESTO_ADMIN" || currentUser.role === "STAFF") && (
                  <Link
                    href="/resto/stock-opname"
                    className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition text-xs font-semibold"
                  >
                    Stock Opname
                  </Link>
                )}

                {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "RESTO_ADMIN") && (
                  <Link
                    href="/resto/po-bahan-baku"
                    className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition text-xs font-semibold"
                  >
                    PO Bahan Baku
                  </Link>
                )}

                <Link
                  href="/resto/absensi"
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition text-xs font-semibold"
                >
                  Absensi GPS
                </Link>
              </div>

              {/* Shift Status Badge */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  activeShift
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                    : "bg-red-950/80 text-red-400 border-red-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeShift ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                <span>{activeShift ? "Shift Kasir Buka" : "Shift Tertutup"}</span>
              </div>

              {/* Logout / Switch Account */}
              <Link
                href="/auth/login"
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-zinc-500 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>Memuat Portal Admin...</span>
          </div>
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
