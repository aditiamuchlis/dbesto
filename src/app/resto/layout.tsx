"use client";

import { Suspense } from "react";
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
} from "lucide-react";

function RestoLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentOutlet, currentUser, shifts, switchOutlet, outlets } = useAppStore();

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  const navItems = [
    { label: "POS Kasir", href: "/resto/pos", icon: ShoppingBag },
    { label: "Shift Kasir", href: "/resto/pos/shift", icon: Clock },
    { label: "Riwayat Transaksi", href: "/resto/pos/riwayat", icon: BarChart3 },
    { label: "Stock Opname", href: "/resto/stock-opname", icon: ClipboardList },
    { label: "PO Bahan Baku", href: "/resto/po-bahan-baku", icon: Truck },
    { label: "Absensi GPS", href: "/resto/absensi", icon: MapPin },
    { label: "Laporan Harian", href: "/resto/laporan", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-zinc-900 text-white px-4 py-3 border-b border-zinc-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website D&apos;Besto</span>
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
              <span className="font-extrabold text-sm tracking-wide text-amber-400">
                PORTAL OPERASIONAL RESTO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Shift Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold ${
                activeShift
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-red-950 text-red-400 border border-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeShift ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span>{activeShift ? "Shift Aktif" : "Shift Tertutup"}</span>
            </div>

            {/* Current Outlet Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={currentOutlet.id}
                onChange={(e) => switchOutlet(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id} className="bg-zinc-900 text-white">
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span className="font-medium text-white">{currentUser.name}</span>
              <span className="text-[10px] bg-red-600/30 text-red-300 px-1.5 py-0.2 rounded font-mono">
                {currentUser.role}
              </span>
            </div>

            <Link
              href="/admin"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-2.5 py-1 rounded transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HQ Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Subnav Tabs */}
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
    </div>
  );
}

export default function RestoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-100 flex items-center justify-center p-8">{children}</div>}>
      <RestoLayoutContent>{children}</RestoLayoutContent>
    </Suspense>
  );
}
