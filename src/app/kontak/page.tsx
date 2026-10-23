"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export default function KontakPage() {
  const { outlets } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "saran",
    outletName: "D'Besto Margonda Raya",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {}}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#181310] to-[#261D17] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-amber-400 font-semibold">Kontak & Layanan</span>
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
              PUSAT LAYANAN PELANGGAN
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Hubungi D&apos;Besto
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-xl">
              Kami selalu senang mendengar saran, masukan rasa, pertanyaan kemitraan, atau pesanan
              katering dalam jumlah besar dari Anda.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-xs space-y-6">
              <h3 className="text-xl font-black text-zinc-900">Kantor Pusat (HQ Central)</h3>

              <div className="space-y-4 text-xs text-zinc-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#D32323] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 block text-sm">Alamat Kantor Pusat</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Gedung D&apos;Besto Central Tower Lt. 5, Jl. TB Simatupang No. 88, Cilandak,
                      Jakarta Selatan, DKI Jakarta 12430
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 block text-sm">Customer Care & WhatsApp</strong>
                    <p className="mt-0.5">0811-9988-771 (Senin - Minggu 08.00 - 21.00 WIB)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 block text-sm">Email Resmi</strong>
                    <p className="mt-0.5">halo@dbesto.co.id / kemitraan@dbesto.co.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 block text-sm">Jam Layanan Resto</strong>
                    <p className="mt-0.5">Setiap hari buka 09.00 - 22.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Katering Card */}
            <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                PESANAN JUMLAH BESAR / KATERING
              </span>
              <h4 className="font-extrabold text-base text-zinc-900">
                Paket Box Syukuran & Acara Kantor
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Butuh paket nasi ayam krispi untuk ulang tahun, arisan, syukuran, atau rapat? Dapatkan
                harga khusus untuk pemesanan di atas 50 box.
              </p>
              <a
                href="https://wa.me/628119988771?text=Halo%20D'Besto,%20saya%20ingin%20tanya%20paket%20katering"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-xs"
              >
                <span>Chat WhatsApp Katering</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Feedback Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
                FORMULIR PESAN & SARAN
              </span>
              <h2 className="text-2xl font-black text-zinc-900 mt-1">Kirim Masukan Langsung ke HQ</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Kritik dan saran Anda sangat berharga bagi peningkatan mutu layanan kami.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-zinc-900">Pesan Anda Berhasil Terkirim!</h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  Terima kasih, <strong>{form.name}</strong>. Tim Customer Support D&apos;Besto akan
                  menindaklanjuti pesan Anda secepatnya.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2 rounded-full transition"
                >
                  Tulis Pesan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">No. WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Email</label>
                    <input
                      type="email"
                      placeholder="email@anda.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Kategori Pesan</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323] bg-white cursor-pointer"
                    >
                      <option value="saran">Kritik & Saran Pelayanan</option>
                      <option value="rasa">Kualitas Rasa Produk</option>
                      <option value="kemitraan">Pertanyaan Kemitraan Franchise</option>
                      <option value="katering">Pemesanan Jumlah Besar / Katering</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Cabang Resto yang Dikunjungi</label>
                  <select
                    value={form.outletName}
                    onChange={(e) => setForm({ ...form, outletName: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323] bg-white cursor-pointer"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.name}>
                        {o.name} ({o.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Isi Pesan / Saran Lengkap *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Sampaikan masukan atau pertanyaan Anda secara rinci..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold py-3.5 rounded-full transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Masukan</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#D32323]" />
            <h3 className="text-xl font-black text-zinc-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <strong className="text-zinc-900 text-sm block">Apakah seluruh cabang D&apos;Besto sudah 100% Halal?</strong>
              <p>
                Ya, seluruh jaringan restoran D&apos;Besto telah mengantongi sertifikat Halal resmi dari BPJPH / MUI (Nomor ID0041000012345). Seluruh bahan baku dan proses penggorengan diaudit berkala.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <strong className="text-zinc-900 text-sm block">Bagaimana cara pesan katering box untuk acara?</strong>
              <p>
                Anda dapat menghubungi WhatsApp Customer Care di 0811-9988-771 minimal H-1 sebelum acara untuk memastikan slot penyiapan gorengan ayam hangat sesuai waktu yang Anda inginkan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <strong className="text-zinc-900 text-sm block">Apakah bisa bayar menggunakan QRIS di kasir?</strong>
              <p>
                Seluruh cabang D&apos;Besto telah dilengkapi sistem POS modern yang menerima pembayaran tunai pas, QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay), dan kartu debit.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <strong className="text-zinc-900 text-sm block">Bagaimana cara mengajukan kemitraan franchise?</strong>
              <p>
                Silakan kunjungi menu Kemitraan di website ini atau isi formulir pendaftaran kemitraan. Tim Business Development kami akan menghubungi Anda untuk survei kelayakan lokasi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
