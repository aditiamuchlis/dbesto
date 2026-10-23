"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Share2, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-xs border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-12 w-32">
              <Image
                src="/images/logo/dbesto-logo.png"
                alt="D'Besto Chicken & Burger"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Sajian ayam krispi lezat berkualitas dengan racikan bumbu khas Indonesia.
              100% Halal MUI, higienis, dan terpercaya untuk santapan seluruh keluarga.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#D32323] text-white flex items-center justify-center transition"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#D32323] text-white flex items-center justify-center transition"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/80 rounded-full text-zinc-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Halal No. ID0041000012345</span>
              </div>
            </div>
          </div>

          {/* Navigasi Brand */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Menu & Brand</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-white transition">
                  Katalog Menu
                </Link>
              </li>
              <li>
                <Link href="/promo" className="hover:text-white transition">
                  Promo & Voucher
                </Link>
              </li>
              <li>
                <Link href="/outlet" className="hover:text-white transition">
                  Cari Outlet Terdekat
                </Link>
              </li>
              <li>
                <Link href="/kemitraan" className="hover:text-white transition">
                  Kemitraan Franchise
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-white transition">
                  Tentang D&apos;Besto
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition">
                  Kontak & Pengaduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Modul Resto (Operasional) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Portal Resto</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resto/pos" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Aplikasi POS Kasir</span>
                </Link>
              </li>
              <li>
                <Link href="/resto/pos/shift" className="hover:text-amber-400 transition">
                  Rekonsiliasi Shift Kasir
                </Link>
              </li>
              <li>
                <Link href="/resto/stock-opname" className="hover:text-amber-400 transition">
                  Stock Opname Harian
                </Link>
              </li>
              <li>
                <Link href="/resto/po-bahan-baku" className="hover:text-amber-400 transition">
                  Pengajuan PO Bahan Baku
                </Link>
              </li>
              <li>
                <Link href="/resto/absensi" className="hover:text-amber-400 transition">
                  Terminal Absensi Geofence
                </Link>
              </li>
            </ul>
          </div>

          {/* Super Admin & Kantor Pusat */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Kantor Pusat</h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <span>Gedung D&apos;Besto Central Tower Lt. 5, TB Simatupang, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span>(021) 7890-1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span>info@dbesto.co.id</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  <span>→ Masuk Super Admin HQ</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
          <p>© 2026 D&apos;Besto Chicken & Burger. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-3">
            <span>Kebijakan Privasi</span>
            <span>•</span>
            <span>Syarat & Ketentuan</span>
            <span>•</span>
            <span>SOP Standar Multi-Resto</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
