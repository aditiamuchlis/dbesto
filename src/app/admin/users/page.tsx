"use client";

import { useState } from "react";
import { Users, Plus, UserCheck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/lib/types";

export default function AdminUsersPage() {
  const { users, outlets, addUser } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("CASHIER");
  const [outletId, setOutletId] = useState<string>(outlets[0]?.id || "");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selOutlet = outlets.find((o) => o.id === outletId);
    addUser({
      name,
      email,
      phone,
      role,
      isActive: true,
      outletId: role === "SUPER_ADMIN" ? null : outletId,
      outletName: role === "SUPER_ADMIN" ? "Kantor Pusat (HQ)" : selOutlet?.name,
    });

    setIsModalOpen(false);
    setSuccessMsg(`Akun "${name}" [${role}] berhasil dibuat!`);
    setName("");
    setEmail("");
    setPhone("");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MANAJEMEN PENGGUNA
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Akun Staf Resto & Kantor Pusat</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Total {users.length} akun pengguna dengan Role-Based Access Control (RBAC)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-4">Nama Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Penempatan Cabang</th>
                <th className="p-4">Kontak</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/70">
                  <td className="p-4 font-bold text-zinc-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-700">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-zinc-600 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "RESTO_ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : u.role === "CASHIER"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-zinc-800">{u.outletName || "Semua Cabang (Global)"}</td>
                  <td className="p-4 text-zinc-500">{u.phone || "-"}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      AKTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-lg text-zinc-900">Buat Akun Karyawan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Karyawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Email Resmi:</label>
                <input
                  type="email"
                  required
                  placeholder="kasir.baru@dbesto.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nomor WhatsApp / Telepon:</label>
                <input
                  type="text"
                  placeholder="0812-XXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Peran Akses (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-bold"
                >
                  <option value="CASHIER">CASHIER (Kasir Resto)</option>
                  <option value="STAFF">STAFF (Karyawan Operasional/Dapur)</option>
                  <option value="RESTO_ADMIN">RESTO_ADMIN (Manager Cabang)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Kantor Pusat HQ)</option>
                </select>
              </div>

              {role !== "SUPER_ADMIN" && (
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Asosiasi Cabang Resto:</label>
                  <select
                    value={outletId}
                    onChange={(e) => setOutletId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
