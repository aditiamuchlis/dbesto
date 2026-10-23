"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Lock, Mail, ArrowRight, ShieldCheck, ShoppingBag, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { users, switchUser } = useAppStore();
  const [email, setEmail] = useState("kasir.margonda@dbesto.co.id");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    switchUser(matched.id);
    router.push("/admin");
  };

  const handleQuickDemo = (userId: string) => {
    const user = users.find((u) => u.id === userId) || users[0];
    switchUser(user.id);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-radial-at-t from-red-950/40 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="relative h-14 w-36 mx-auto mb-2">
            <Image
              src="/images/logo/dbesto-logo.png"
              alt="D'Besto"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Portal Internal D&apos;Besto</h2>
          <p className="text-xs text-zinc-400">
            Masuk untuk mengakses Dashboard Admin, Operasional POS Kasir, atau Manajemen Resto.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1">Email Karyawan / HQ:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@dbesto.co.id"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-[#D32323]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-[#D32323]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/25 transition cursor-pointer"
          >
            Masuk ke Dashboard
          </button>
        </form>

        {/* Demo Fast Login Buttons for all 4 roles */}
        <div className="pt-4 border-t border-zinc-800 space-y-2.5">
          <p className="text-[11px] font-bold text-zinc-400 text-center uppercase tracking-wider">
            1-Click Demo Login Sesuai Role:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo("usr-super-01")}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Super Admin</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">HQ Central</span>
            </button>

            <button
              onClick={() => handleQuickDemo("usr-adm-mrg")}
              className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Resto Admin</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">Manajer Cabang</span>
            </button>

            <button
              onClick={() => handleQuickDemo("usr-kasir-mrg")}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Kasir Resto</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">Terminal POS</span>
            </button>

            <button
              onClick={() => handleQuickDemo("usr-staf-mrg")}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
            >
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Staff Karyawan</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">Dapur & Stok</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition">
            ← Kembali ke Halaman Utama Website
          </Link>
        </div>
      </div>
    </div>
  );
}
