"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  FileText,
} from "lucide-react";
import { signJwtToken } from "@/lib/jwt";

export default function LoginPage() {
  const router = useRouter();
  const { users, switchUser } = useAppStore();

  const [emailOrUsername, setEmailOrUsername] = useState("superadmin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const trimmed = emailOrUsername.trim().toLowerCase();

      // Attempt login via API route first
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: trimmed, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Username/email atau password salah.");
        setIsLoading(false);
        return;
      }

      // Store JWT Token in localStorage
      localStorage.setItem("dbesto_jwt_token", data.token);

      // Switch active user in client store
      switchUser(data.user.id);

      setSuccessMessage(`Login berhasil sebagai ${data.user.name} [${data.user.role}]! Mengalihkan...`);

      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err) {
      // Client-side fallback authentication if offline
      const matched = users.find(
        (u) =>
          u.email.toLowerCase() === emailOrUsername.trim().toLowerCase() ||
          (u.username && u.username.toLowerCase() === emailOrUsername.trim().toLowerCase())
      );

      if (!matched || matched.password !== password) {
        setErrorMessage("Username atau password tidak cocok.");
        setIsLoading(false);
        return;
      }

      const clientToken = await signJwtToken({
        id: matched.id,
        email: matched.email,
        name: matched.name,
        role: matched.role,
        outletId: matched.outletId,
        outletName: matched.outletName,
      });

      localStorage.setItem("dbesto_jwt_token", clientToken);
      switchUser(matched.id);
      setSuccessMessage(`Login berhasil sebagai ${matched.name}! Mengalihkan...`);

      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-radial-at-t from-red-950/40 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/95 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header Branding */}
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
            Masuk dengan kredensial akun terdaftar untuk verifikasi token JWT.
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Real Form Login */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1">Username atau Email:</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Contoh: superadmin atau nama@dbesto.co.id"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D32323] transition"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun"
                className="w-full pl-9 pr-10 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D32323] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D32323] hover:bg-[#B31818] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? "Memverifikasi JWT..." : "Masuk dengan JWT"}</span>
          </button>
        </form>

        {/* Collapsible Account List / Guide */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-xs text-zinc-400 hover:text-white py-2 px-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 transition"
          >
            <span className="flex items-center gap-2 font-semibold">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Daftar Akun & Password (ACCOUNTS.md)</span>
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">
              {showGuide ? "▲ Sembunyikan" : "▼ Buka"}
            </span>
          </button>

          {showGuide && (
            <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3 text-[11px] space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-700/50 pb-1.5">
                <div>
                  <p className="font-bold text-white">Super Admin HQ</p>
                  <p className="text-zinc-400 font-mono">user: superadmin</p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    admin123
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-700/50 pb-1.5">
                <div>
                  <p className="font-bold text-white">Store Manager (Margonda)</p>
                  <p className="text-zinc-400 font-mono">user: manager.margonda</p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    manager123
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-700/50 pb-1.5">
                <div>
                  <p className="font-bold text-white">Kasir Resto (Margonda)</p>
                  <p className="text-zinc-400 font-mono">user: kasir.margonda</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    kasir123
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Staf Dapur / Kitchen</p>
                  <p className="text-zinc-400 font-mono">user: staf.margonda</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    staf123
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-1">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition">
            ← Kembali ke Website D&apos;Besto
          </Link>
        </div>
      </div>
    </div>
  );
}
