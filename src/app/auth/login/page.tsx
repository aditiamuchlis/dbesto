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
    if (matched.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/resto/pos");
    }
  };

  const handleQuickDemo = (role: string) => {
    const user = users.find((u) => u.role === role) || users[0];
    switchUser(user.id);
    if (user.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/resto/pos");
    }
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
          <h2 className="text-2xl font-black text-white tracking-tight">Portal Terpadu D&apos;Besto</h2>
          <p className="text-xs text-zinc-400">
            Masuk untuk mengakses Sistem POS Kasir, Operasional Cabang, atau HQ Central Hub.
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
            Masuk ke Sistem
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <p className="text-[11px] font-bold text-zinc-400 text-center uppercase tracking-wider">
            Atau Uji Coba Cepat (1-Click Demo Login):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo("SUPER_ADMIN")}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin HQ</span>
            </button>
            <button
              onClick={() => handleQuickDemo("CASHIER")}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Kasir Resto</span>
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
