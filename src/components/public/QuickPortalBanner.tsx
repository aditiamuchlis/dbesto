"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Store, ShieldCheck, UserCheck, ShoppingBag, MapPin } from "lucide-react";

export function QuickPortalBanner() {
  const { currentUser, currentOutlet, switchUser, switchOutlet, users, outlets } = useAppStore();

  return (
    <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">
            D&apos;Besto Ecosystem Demo
          </span>
          <span className="text-zinc-500">|</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Cabang:</span>
            <select
              value={currentOutlet.id}
              onChange={(e) => switchOutlet(e.target.value)}
              className="bg-zinc-800 text-amber-300 font-medium rounded px-2 py-0.5 border border-zinc-700 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.city})
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <UserCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="text-zinc-400">Role:</span>
            <select
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-zinc-800 text-red-300 font-medium rounded px-2 py-0.5 border border-zinc-700 focus:outline-none focus:border-red-400 cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — [{u.role}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/resto/pos"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-medium px-2.5 py-1 rounded transition shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>POS Kasir</span>
          </Link>
          <Link
            href="/resto/pos/shift"
            className="hidden md:flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 transition"
          >
            Shift Kasir
          </Link>
          <Link
            href="/resto/stock-opname"
            className="hidden md:flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 transition"
          >
            Stock Opname
          </Link>
          <Link
            href="/resto/po-bahan-baku"
            className="hidden md:flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 transition"
          >
            PO Bahan Baku
          </Link>
          <Link
            href="/resto/absensi"
            className="hidden md:flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 transition"
          >
            Absensi GPS
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-2.5 py-1 rounded transition shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HQ Super Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
