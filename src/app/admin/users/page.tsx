"use client";

import { useState } from "react";
import { Users, Plus, UserCheck, ShieldCheck, CheckCircle2, Edit2, Trash2, X, Search, KeyRound } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { UserRole, User } from "@/lib/types";

export default function AdminUsersPage() {
  const { users, outlets, addUser, updateUser, deleteUser } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("pass123");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("CASHIER");
  const [outletId, setOutletId] = useState<string>(outlets[0]?.id || "");

  const openAddModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setUsername("");
    setPassword("dbesto123");
    setPhone("");
    setRole("CASHIER");
    setOutletId(outlets[0]?.id || "");
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setUsername(u.username || u.email.split("@")[0]);
    setPassword(u.password || "pass123");
    setPhone(u.phone || "");
    setRole(u.role);
    setOutletId(u.outletId || outlets[0]?.id || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selOutlet = outlets.find((o) => o.id === outletId);

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        username,
        password,
        phone,
        role,
        outletId: role === "SUPER_ADMIN" ? null : outletId,
        outletName: role === "SUPER_ADMIN" ? "Kantor Pusat (HQ)" : selOutlet?.name,
      });
      setSuccessMsg(`Akun "${name}" berhasil diperbarui!`);
    } else {
      addUser({
        name,
        email,
        username,
        password,
        phone,
        role,
        isActive: true,
        outletId: role === "SUPER_ADMIN" ? null : outletId,
        outletName: role === "SUPER_ADMIN" ? "Kantor Pusat (HQ)" : selOutlet?.name,
      });
      setSuccessMsg(`Akun baru "${name}" [${role}] berhasil dibuat!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = (u: User) => {
    if (confirm(`Yakin ingin menghapus akun "${u.name}"?`)) {
      deleteUser(u.id);
      setSuccessMsg(`Akun "${u.name}" berhasil dihapus.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            MANAJEMEN PENGGUNA (CRUD)
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Akun Staf Resto & Kantor Pusat</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Total {users.length} akun pengguna terdaftar dengan Role-Based Access Control (RBAC) & Autentikasi JWT
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-xs px-5 py-3 rounded-full transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, username, atau role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-zinc-800"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-4">Nama Pengguna</th>
                <th className="p-4">Username / Email</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Penempatan Cabang</th>
                <th className="p-4">Password</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/70">
                  <td className="p-4 font-bold text-zinc-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[10px] text-zinc-400">{u.phone || "-"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 font-mono">
                    <p className="font-bold text-zinc-900">{u.username || "-"}</p>
                    <p className="text-[10px] text-zinc-400">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : u.role === "RESTO_ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : u.role === "CASHIER"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-zinc-800">{u.outletName || "Semua Cabang (HQ)"}</td>
                  <td className="p-4 font-mono text-zinc-500">
                    <span className="bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-bold">
                      {u.password || "••••••••"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition"
                        title="Edit Akun"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-zinc-900">
                {editingUser ? "Edit Akun Pengguna" : "Buat Akun Karyawan Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Karyawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Username Login:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: kasir.baru"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Password:</label>
                  <input
                    type="text"
                    required
                    placeholder="Kata Sandi Akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Email Resmi:</label>
                <input
                  type="email"
                  required
                  placeholder="nama@dbesto.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nomor WhatsApp / Telepon:</label>
                <input
                  type="text"
                  placeholder="0812-XXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Peran Akses (Role):</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Pusat HQ)</option>
                    <option value="RESTO_ADMIN">RESTO_ADMIN (Manajer Cabang)</option>
                    <option value="CASHIER">CASHIER (Kasir Resto)</option>
                    <option value="STAFF">STAFF (Dapur & Kitchen)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Penempatan Cabang:</label>
                  <select
                    disabled={role === "SUPER_ADMIN"}
                    value={outletId}
                    onChange={(e) => setOutletId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] cursor-pointer disabled:bg-zinc-100 disabled:text-zinc-400"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D32323] hover:bg-[#B31818] text-white font-bold shadow-md cursor-pointer"
                >
                  {editingUser ? "Simpan Perubahan" : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
