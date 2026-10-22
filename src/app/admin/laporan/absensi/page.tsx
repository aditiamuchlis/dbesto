"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import { MapPin, Users, CheckCircle2, Clock } from "lucide-react";

export default function AdminAbsensiPage() {
  const { attendances, outlets } = useAppStore();
  const [selectedOutlet, setSelectedOutlet] = useState("all");

  const filtered =
    selectedOutlet === "all"
      ? attendances
      : attendances.filter((a) => a.outletId === selectedOutlet);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
            KEDISIPLINAN & KEHADIRAN
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Laporan & Audit Absensi Karyawan</h2>
          <p className="text-xs text-zinc-500 mt-1">Audit keabsahan titik koordinat GPS geofencing dan bukti selfie kehadiran</p>
        </div>

        <select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          className="text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white"
        >
          <option value="all">Semua Cabang Resto</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Selfie</th>
                <th className="p-3.5">Nama Staf</th>
                <th className="p-3.5">Cabang Resto</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Clock In</th>
                <th className="p-3.5">Clock Out</th>
                <th className="p-3.5">Koordinat & Jarak GPS</th>
                <th className="p-3.5">Kedisiplinan</th>
                <th className="p-3.5">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-zinc-50/70">
                  <td className="p-3.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-200 border border-zinc-300">
                      {att.inPhotoUrl && (
                        <Image src={att.inPhotoUrl} alt={att.userName || "Staf"} fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-zinc-900">{att.userName}</td>
                  <td className="p-3.5 font-semibold text-zinc-700">{att.outletName}</td>
                  <td className="p-3.5">{att.date}</td>
                  <td className="p-3.5 font-semibold text-emerald-700">{formatTanggalIndo(att.clockInTime, true)}</td>
                  <td className="p-3.5">{att.clockOutTime ? formatTanggalIndo(att.clockOutTime, true) : "-"}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-zinc-700 block">
                      {att.inLatitude.toFixed(4)}, {att.inLongitude.toFixed(4)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Jarak: {att.inDistanceM}m dari resto
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        att.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {att.status} {att.lateMinutes > 0 && `(+${att.lateMinutes}m)`}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-500 max-w-xs truncate">{att.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
