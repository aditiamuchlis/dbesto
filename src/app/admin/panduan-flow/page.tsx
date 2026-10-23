"use client";

import Link from "next/link";
import { RoleWorkflowGuide } from "@/components/common/RoleWorkflowGuide";
import { useAppStore } from "@/lib/store";
import {
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Sparkles,
} from "lucide-react";

export default function PanduanFlowPage() {
  const { currentUser } = useAppStore();

  const roleMapping = {
    SUPER_ADMIN: "SUPER_ADMIN",
    RESTO_ADMIN: "RESTO_ADMIN",
    CASHIER: "CASHIER",
    STAFF: "STAFF",
  } as const;

  const currentInitialRole = roleMapping[currentUser.role] || "SUPER_ADMIN";

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-100 text-[#D32323] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              STANDAR OPERASIONAL PROSEDUR (SOP)
            </span>
            <span className="text-xs text-zinc-400 font-bold">•</span>
            <span className="text-xs text-zinc-500 font-semibold">Sistem Enterprise D&apos;Besto</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <Workflow className="w-7 h-7 text-[#D32323]" />
            <span>Peta Flow Proses Bisnis & Panduan Peran</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Panduan komprehensif alur kerja harian untuk seluruh peran (Super Admin, Store Manager, Kasir, Dapur, hingga Pelanggan Publik) agar setiap aktivitas operasional terstandarisasi dan mudah dipahami.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition self-start sm:self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Main Interactive Guide Component */}
      <RoleWorkflowGuide initialRole={currentInitialRole} />

      {/* Key Principle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-zinc-900">1. Ketepatan & Validasi Geofence</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Seluruh staf wajib presensi di dalam radius 100 meter dari titik koordinat resmi cabang dengan foto selfie wajah asli sebelum jam operasional dimulai.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-zinc-900">2. Transparansi Kasir & Shift</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Modal kasir wajib tercatat saat Buka Shift. Semua transaksi dicetak nota resminya, dan penghitungan kas fisik wajib sinkron sebelum Tutup Shift.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#D32323] flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-zinc-900">3. Kualitas & Standardisasi Resep</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Pasokan bahan baku resmi langsung dari gudang HQ melalui alur PO terverifikasi untuk menjamin cita rasa rempah khas dan sertifikasi 100% Halal.
          </p>
        </div>
      </div>
    </div>
  );
}
