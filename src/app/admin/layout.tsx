"use client";

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
  Bell,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, outlets } = useAppStore();

  const navigation = [
    { label: "Dashboard Utama", href: "/admin", icon: LayoutDashboard },
    { label: "Master Cabang Resto", href: "/admin/outlets", icon: Store },
    { label: "Master Akun Staf", href: "/admin/users", icon: Users },
    {
      group: "LAPORAN & AUDIT",
      items: [
        { label: "Laporan Pendapatan", href: "/admin/laporan/pemasukan", icon: DollarSign },
        { label: "Laporan Tiket POS", href: "/admin/laporan/pos", icon: ShoppingCart },
        { label: "Audit Stock Opname", href: "/admin/laporan/stock-opname", icon: ClipboardList },
        { label: "Approval PO Bahan", href: "/admin/laporan/po-bahan-baku", icon: Truck },
        { label: "Audit Absensi GPS", href: "/admin/laporan/absensi", icon: MapPin },
      ],
    },
    {
      group: "MASTER CMS & INVENTARIS",
      items: [
        { label: "Master Bahan Baku", href: "/admin/master/bahan-baku", icon: Package },
        { label: "Katalog Menu", href: "/admin/menu", icon: UtensilsCrossed },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 text-zinc-300 flex flex-col border-r border-zinc-800 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-24">
              <Image
                src="/images/logo/dbesto-logo.png"
                alt="D'Besto"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full">
            HQ
          </span>
        </div>

        {/* User context badge */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
            HQ
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
            <p className="text-[10px] text-zinc-400 font-mono">ROLE: {currentUser.role}</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            {navigation.slice(0, 3).map((nav: any) => {
              const Icon = nav.icon;
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Group 1 */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-3 block mb-2">
              Laporan & Audit
            </span>
            {(navigation[3] as any).items.map((nav: any) => {
              const Icon = nav.icon;
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Group 2 */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-3 block mb-2">
              Master & CMS
            </span>
            {(navigation[4] as any).items.map((nav: any) => {
              const Icon = nav.icon;
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 rounded-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website D&apos;Besto</span>
          </Link>
          <Link
            href="/resto/pos"
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 transition"
          >
            <span>→ Masuk Terminal POS Kasir</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-zinc-900 tracking-tight">
              KANTOR PUSAT D&apos;BESTO (HQ COMMAND CENTER)
            </h1>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-bold">
              {outlets.length} Cabang Terhubung
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sistem Cloud Online</span>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
