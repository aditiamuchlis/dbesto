"use client";

import { useState } from "react";
import { formatTanggalIndo } from "@/lib/formatters";
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  MessageCircle,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  budget: string;
  hasLocation: boolean;
  status: "NEW" | "CONTACTED" | "SURVEY" | "APPROVED" | "REJECTED";
  submittedAt: string;
  notes?: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-01",
    name: "Rian Hidayat",
    phone: "0812-9988-1122",
    email: "rian.hidayat@gmail.com",
    city: "Tangerang Selatan",
    budget: "Rp 150 Juta (Paket Ruko)",
    hasLocation: true,
    status: "NEW",
    submittedAt: "2026-10-23T14:30:00Z",
    notes: "Sudah sewa ruko 1 lantai dekat kampus UIN Ciputat.",
  },
  {
    id: "lead-02",
    name: "Dr. Siti Khadijah",
    phone: "0813-7788-9900",
    email: "siti.khadijah@yahoo.com",
    city: "Bekasi Timur",
    budget: "Rp 250 Juta (Paket Resto Express)",
    hasLocation: true,
    status: "SURVEY",
    submittedAt: "2026-10-21T09:15:00Z",
    notes: "Lokasi di jalan protokol dekat perumahan Grand Wisata.",
  },
  {
    id: "lead-03",
    name: "Arief Wicaksono",
    phone: "0811-2233-4455",
    email: "arief.w@gmail.com",
    city: "Bandung",
    budget: "Rp 85 Juta (Paket Booth)",
    hasLocation: false,
    status: "CONTACTED",
    submittedAt: "2026-10-19T16:00:00Z",
    notes: "Sedang mencari titik teras minimarket Indomaret / Alfamart.",
  },
  {
    id: "lead-04",
    name: "Hj. Maimunah",
    phone: "0812-4455-6677",
    email: "hj.maimunah@gmail.com",
    city: "Depok",
    budget: "Rp 150 Juta (Paket Ruko)",
    hasLocation: true,
    status: "APPROVED",
    submittedAt: "2026-10-15T11:00:00Z",
    notes: "Akad kemitraan selesai, masuk tahap renovasi & setting fryer.",
  },
];

export default function AdminKemitraanPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filtered =
    filterStatus === "ALL" ? leads : leads.filter((l) => l.status === filterStatus);

  const updateStatus = (id: string, newStatus: Lead["status"]) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            FRANCHISE & BUSINESS DEVELOPMENT
          </span>
          <h2 className="text-2xl font-black text-zinc-900">Pipeline Calon Mitra Franchise</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Pantau dan tindak lanjuti pendaftaran calon mitra yang masuk dari website publik D&apos;Besto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-100 border border-zinc-200 text-xs font-bold px-3 py-2 rounded-xl text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Status ({leads.length})</option>
            <option value="NEW">Baru Masuk</option>
            <option value="CONTACTED">Sudah Dihubungi</option>
            <option value="SURVEY">Jadwal Survei Lokasi</option>
            <option value="APPROVED">Disetujui / Akad</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Aplikasi Baru</span>
          <p className="text-2xl font-black text-red-600">
            {leads.filter((l) => l.status === "NEW").length} Lead
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Perlu dihubungi dalam 24 jam</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Tahap Follow-up</span>
          <p className="text-2xl font-black text-amber-600">
            {leads.filter((l) => l.status === "CONTACTED").length} Lead
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Konsultasi anggaran & paket</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Survei Lokasi</span>
          <p className="text-2xl font-black text-blue-600">
            {leads.filter((l) => l.status === "SURVEY").length} Titik
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Verifikasi traffic & kelayakan</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Akad Mitra Lolos</span>
          <p className="text-2xl font-black text-emerald-600">
            {leads.filter((l) => l.status === "APPROVED").length} Mitra
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Siap persiapan opening</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h3 className="font-black text-base text-zinc-900">Daftar Formulir Aplikasi Kemitraan</h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {filtered.map((lead) => (
            <div key={lead.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-zinc-50 transition">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-extrabold text-base text-zinc-900">{lead.name}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      lead.status === "NEW"
                        ? "bg-red-100 text-red-800"
                        : lead.status === "CONTACTED"
                        ? "bg-amber-100 text-amber-800"
                        : lead.status === "SURVEY"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                  <span className="flex items-center gap-1 font-semibold text-zinc-900">
                    <MapPin className="w-3.5 h-3.5 text-[#D32323]" />
                    {lead.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    {lead.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    {lead.email}
                  </span>
                  <span className="text-zinc-500 font-mono">
                    Anggaran: <strong>{lead.budget}</strong>
                  </span>
                </div>

                {lead.notes && (
                  <p className="text-xs text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60 max-w-2xl">
                    &quot;{lead.notes}&quot;
                  </p>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(lead.name)},%20kami%20dari%20tim%20Kemitraan%20D'Besto%20HQ`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value as any)}
                  className="bg-zinc-100 border border-zinc-200 text-xs font-bold p-2 rounded-xl text-zinc-800 focus:outline-none cursor-pointer"
                >
                  <option value="NEW">Status: NEW</option>
                  <option value="CONTACTED">Status: CONTACTED</option>
                  <option value="SURVEY">Status: SURVEY LOKASI</option>
                  <option value="APPROVED">Status: APPROVED</option>
                  <option value="REJECTED">Status: REJECTED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
