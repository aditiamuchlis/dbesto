"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  ShoppingBag,
  Clock,
  ClipboardList,
  Truck,
  MapPin,
  BarChart3,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  CalendarCheck,
  LayoutDashboard,
  Workflow,
  X,
} from "lucide-react";
import { RoleWorkflowGuide } from "@/components/common/RoleWorkflowGuide";

function RestoLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { currentOutlet, currentUser, shifts, switchOutlet, switchUser, outlets, users } =
    useAppStore();

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  // Filter navigation items strictly based on role
  const getNavItems = () => {
    if (currentUser.role === "CASHIER") {
      return [
        { label: "POS Kasir", href: "/resto/pos", icon: ShoppingBag },
        { label: "Shift Kasir", href: "/resto/pos/shift", icon: Clock },
        { label: "Riwayat Transaksi", href: "/resto/pos/riwayat", icon: BarChart3 },
        { label: "Absensi GPS", href: "/resto/absensi", icon: MapPin },
        { label: "Riwayat Presensi", href: "/resto/absensi/riwayat", icon: CalendarCheck },
        { label: "Peta Flow SOP", href: "/admin/panduan-flow", icon: Workflow },
      ];
    }

    if (currentUser.role === "STAFF") {
      return [
        { label: "Absensi GPS", href: "/resto/absensi", icon: MapPin },
        { label: "Riwayat Presensi", href: "/resto/absensi/riwayat", icon: CalendarCheck },
        { label: "Stock Opname", href: "/resto/stock-opname", icon: ClipboardList },
        { label: "Riwayat Opname", href: "/resto/stock-opname/riwayat", icon: ClipboardList },
        { label: "Peta Flow SOP", href: "/admin/panduan-flow", icon: Workflow },
      ];
    }

    // SUPER_ADMIN and RESTO_ADMIN
    return [
      { label: "POS Kasir", href: "/resto/pos", icon: ShoppingBag },
      { label: "Shift Kasir", href: "/resto/pos/shift", icon: Clock },
      { label: "Riwayat Transaksi", href: "/resto/pos/riwayat", icon: BarChart3 },
      { label: "Stock Opname", href: "/resto/stock-opname", icon: ClipboardList },
      { label: "PO Bahan Baku", href: "/resto/po-bahan-baku", icon: Truck },
      { label: "Absensi GPS", href: "/resto/absensi", icon: MapPin },
      { label: "Laporan Harian", href: "/resto/laporan", icon: BarChart3 },
      { label: "Peta Flow SOP", href: "/admin/panduan-flow", icon: Workflow },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-zinc-900 text-white px-4 py-3 border-b border-zinc-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-white font-bold bg-[#D32323] hover:bg-[#B31818] px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>← Dashboard Internal</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="relative h-7 w-20">
                <Image
                  src="/images/logo/dbesto-logo.png"
                  alt="D'Besto"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-zinc-600">|</span>
              <span className="font-extrabold text-xs sm:text-sm tracking-wide text-amber-400 truncate">
                PORTAL OPERASIONAL RESTO
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Shift Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                activeShift
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-red-950 text-red-400 border-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeShift ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span className="hidden sm:inline">{activeShift ? "Shift Aktif" : "Shift Tutup"}</span>
            </div>

            {/* Current Outlet Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={currentOutlet.id}
                onChange={(e) => switchOutlet(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id} className="bg-zinc-900 text-white">
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick User / Role Switcher in Resto Portal */}
            <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-zinc-900 text-white">
                    {u.name} [{u.role}]
                  </option>
                ))}
              </select>
            </div>

            {/* Panduan Flow Bisnis Button */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-zinc-950 font-black px-2.5 py-1 rounded-lg text-xs transition cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panduan Flow Bisnis</span>
            </button>

            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
              title="Ke Website D'Besto"
            >
              Web
            </Link>
          </div>
        </div>
      </header>

      {/* Subnav Tabs (Role-Filtered) */}
      <nav className="bg-white border-b border-zinc-200 px-4 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-[#D32323] text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">{children}</main>

      {/* Interactive Modal: Panduan Flow Bisnis Role */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-150 my-6 relative">
            <div className="flex items-center justify-between p-4 bg-zinc-950 text-white border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Workflow className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black tracking-wide">
                  PANDUAN ALUR PROSES BISNIS & SOP PERAN
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <RoleWorkflowGuide
                initialRole={
                  currentUser.role === "SUPER_ADMIN"
                    ? "SUPER_ADMIN"
                    : currentUser.role === "RESTO_ADMIN"
                    ? "RESTO_ADMIN"
                    : currentUser.role === "CASHIER"
                    ? "CASHIER"
                    : "STAFF"
                }
                onNavigate={() => setIsGuideOpen(false)}
              />
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-medium">
                Peran login Anda saat ini: <strong className="text-zinc-900">{currentUser.name} ({currentUser.role})</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold transition shadow-xs cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-zinc-500 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>Memuat Modul Resto...</span>
          </div>
        </div>
      }
    >
      <RestoLayoutContent>{children}</RestoLayoutContent>
    </Suspense>
  );
}
