"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Store,
  ShoppingBag,
  Clock,
  ClipboardList,
  Truck,
  MapPin,
  Users,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Receipt,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Sparkles,
  Info,
  HelpCircle,
  Package,
  Layers,
  FileCheck,
} from "lucide-react";

export type RoleType = "SUPER_ADMIN" | "RESTO_ADMIN" | "CASHIER" | "STAFF" | "PUBLIC";

interface RoleWorkflowGuideProps {
  initialRole?: RoleType;
  compact?: boolean;
  onNavigate?: () => void;
}

export function RoleWorkflowGuide({
  initialRole = "SUPER_ADMIN",
  compact = false,
  onNavigate,
}: RoleWorkflowGuideProps) {
  const [activeRole, setActiveRole] = useState<RoleType>(initialRole);

  const rolesData = {
    SUPER_ADMIN: {
      title: "Super Admin (HQ Pusat)",
      badge: "HQ Command Center",
      badgeColor: "bg-amber-500 text-zinc-950",
      description:
        "Pemegang otoritas tertinggi sistem D'Besto. Bertanggung jawab atas ekspansi cabang, standardisasi resep & menu, suplai bahan baku gudang pusat, audit kepatuhan kasir & absensi, serta analisis keuntungan finansial jaringan nasional.",
      dailyGoal: "Memastikan seluruh cabang berjalan sesuai SOP, suplai bahan terjamin, dan omzet termonitor real-time.",
      steps: [
        {
          num: 1,
          time: "Pagi (08:00 WIB)",
          title: "Audit Kehadiran & Geofence GPS Staf",
          desc: "Periksa kepatuhan presensi seluruh karyawan di semua cabang resto melalui verifikasi selfie dan koordinat GPS geofence 100m.",
          actionText: "Audit Absensi GPS",
          actionUrl: "/admin/laporan/absensi",
          icon: MapPin,
          tag: "Audit",
        },
        {
          num: 2,
          time: "Pagi - Siang (09:00 - 11:00 WIB)",
          title: "Otorisasi & Approval PO Bahan Baku Gudang HQ",
          desc: "Tinjau pesanan pasokan ayam potong, bumbu sadas, dan tepung dari cabang resto. Setujui PO untuk diteruskan ke logistik gudang.",
          actionText: "Approval PO Bahan",
          actionUrl: "/admin/laporan/po-bahan-baku",
          icon: Truck,
          tag: "Logistik",
        },
        {
          num: 3,
          time: "Siang - Sore (13:00 - 16:00 WIB)",
          title: "Audit & Validasi Stock Opname Seluruh Cabang",
          desc: "Tinjau laporan hitung fisik bahan baku dari Store Manager. Validasi selisih stok fisik vs sistem untuk penyesuaian HPP otomatis.",
          actionText: "Audit Stock Opname",
          actionUrl: "/admin/laporan/stock-opname",
          icon: ClipboardList,
          tag: "Inventaris",
        },
        {
          num: 4,
          time: "Berkala (Fleksibel)",
          title: "Master Menu, Bahan, Cabang & Akun Karyawan",
          desc: "Kelola master cabang resto baru, pemetaan titik koordinat radius geofence, katalog resep menu, harga jual, dan hak akses staf.",
          actionText: "Master Cabang & Menu",
          actionUrl: "/admin/outlets",
          icon: Store,
          tag: "Master Data",
        },
        {
          num: 5,
          time: "Malam (21:00 WIB / Closing)",
          title: "Analisis Laporan Omzet & Penjualan Global",
          desc: "Pantau omzet bersih jaringan, perbandingan performa antar cabang (Margonda vs Tebet), dan rincian metode pembayaran (Cash vs QRIS).",
          actionText: "Laporan Omzet Global",
          actionUrl: "/admin/laporan/pemasukan",
          icon: DollarSign,
          tag: "Finansial",
        },
      ],
      accessMatrix: [
        { label: "Dashboard Eksekutif HQ & KPI", status: "Full Access" },
        { label: "Master Cabang & Geofence", status: "Full CRUD" },
        { label: "Master Akun Staf & Role", status: "Full CRUD" },
        { label: "Approval PO Bahan Gudang HQ", status: "Otorisator Tunggal" },
        { label: "Audit Absensi Selfie & Radar GPS", status: "Full Audit" },
        { label: "Laporan Finansial Konsolidasi", status: "Full Access" },
      ],
    },
    RESTO_ADMIN: {
      title: "Resto Admin / Store Manager",
      badge: "Kepala Cabang Resto",
      badgeColor: "bg-blue-600 text-white",
      description:
        "Penanggung jawab penuh operasional pada 1 cabang resto fisik D'Besto. Mengawasi operasional harian, kepatuhan kasir, suplai bahan baku dapur, dan pencapaian target omzet cabang.",
      dailyGoal: "Operasional cabang berjalan mulus, tidak ada kehabisan bahan baku (zero out-of-stock), dan target omzet tercapai.",
      steps: [
        {
          num: 1,
          time: "Pagi (08:30 WIB)",
          title: "Buka Resto & Cek Presensi Karyawan Cabang",
          desc: "Pastikan kru kasir dan dapur hadir tepat waktu di dalam zona radius cabang melalui log presensi selfie dan GPS.",
          actionText: "Cek Kehadiran Staf",
          actionUrl: "/resto/absensi/riwayat",
          icon: UserCheck,
          tag: "Kedisiplinan",
        },
        {
          num: 2,
          time: "Pagi (09:00 WIB)",
          title: "Cek Stok Kritis & Buat Request PO Bahan Baku",
          desc: "Pantau stok ayam marinasi, minyak goreng, dan packaging. Jika mendekati batas minimum alert, segera ajukan PO ke gudang HQ.",
          actionText: "Buat Request PO",
          actionUrl: "/resto/po-bahan-baku",
          icon: Truck,
          tag: "Pasokan",
        },
        {
          num: 3,
          time: "Pagi (09:30 WIB)",
          title: "Supervisi Pembukaan Shift Kasir",
          desc: "Awasi pengisian kas modal awal kasir (Rp 300.000) dan pastikan terminal POS kasir siap melayani transaksi pelanggan.",
          actionText: "Supervisi Shift Kasir",
          actionUrl: "/resto/pos/shift",
          icon: Clock,
          tag: "Kasir",
        },
        {
          num: 4,
          time: "Tengah Hari (11:00 - 15:00 WIB)",
          title: "Supervisi Layanan POS & Kelancaran Dapur",
          desc: "Pantau antrean pesanan kasir, kecepatan penyajian ayam krispi, serta tiket transaksi penjualan secara live.",
          actionText: "Riwayat Transaksi Cabang",
          actionUrl: "/resto/pos/riwayat",
          icon: ShoppingBag,
          tag: "Pelayanan",
        },
        {
          num: 5,
          time: "Sore (16:00 WIB)",
          title: "Penerimaan Bahan Baku (Good Receipt Note)",
          desc: "Cek fisik pasokan barang yang datang dari logistik HQ, hitung kuantiti riil, dan lampirkan bukti foto penerimaan.",
          actionText: "Cek Status PO Bahan",
          actionUrl: "/resto/po-bahan-baku/riwayat",
          icon: Package,
          tag: "Logistik",
        },
        {
          num: 6,
          time: "Malam (21:30 WIB / Closing)",
          title: "Hitung Stock Opname & Tutup Buku Harian",
          desc: "Pimpin penghitungan stok fisik sisa bahan baku di dapur, submit opname ke HQ, dan cek rekap omzet harian cabang.",
          actionText: "Submit Stock Opname",
          actionUrl: "/resto/stock-opname",
          icon: ClipboardList,
          tag: "Closing",
        },
      ],
      accessMatrix: [
        { label: "Dashboard Operasional Cabang", status: "Cabang Terdaftar" },
        { label: "Buka/Tutup & Rekap Shift Kasir", status: "Supervisi Penuh" },
        { label: "Request PO Pasokan Bahan", status: "Pembuat PO" },
        { label: "Stock Opname Fisik Cabang", status: "Submitter & Penanggungjawab" },
        { label: "Laporan Harian Omzet Cabang", status: "Akses Cabang" },
      ],
    },
    CASHIER: {
      title: "Cashier / Kasir Resto",
      badge: "Garda Depan Kasir",
      badgeColor: "bg-[#D32323] text-white",
      description:
        "Petugas kasir di meja counter restoran D'Besto. Melayani pemesanan langsung dari konsumen (Dine In / Take Away), menginput pesanan cepat di POS, memproses pembayaran akurat, dan mencetak nota struk resmi.",
      dailyGoal: "Transaksi cepat (< 60 detik per pelanggan), uang laci kas akurat 100% tanpa selisih, dan pelanggan puas.",
      steps: [
        {
          num: 1,
          time: "Saat Datang (08:45 WIB)",
          title: "Presensi Wajah Selfie & Validasi Geofence GPS",
          desc: "Buka terminal absensi, izinkan akses kamera & GPS. Ambil selfie di dalam radius 100 meter dari cabang resto dan lakukan Clock In.",
          actionText: "Buka Terminal Absensi",
          actionUrl: "/resto/absensi",
          icon: MapPin,
          tag: "Presensi Masuk",
        },
        {
          num: 2,
          time: "Sebelum Melayani (09:00 WIB)",
          title: "Buka Shift Kasir & Hitung Modal Awal",
          desc: "Buka menu Shift Kasir, masukkan saldo kas modal uang receh awal (standar Rp 300.000). Kasir siap melakukan transaksi.",
          actionText: "Buka Shift Kasir",
          actionUrl: "/resto/pos/shift",
          icon: Clock,
          tag: "Buka Kas",
        },
        {
          num: 3,
          time: "Jam Operasional (09:00 - 21:00 WIB)",
          title: "Layani Transaksi di Terminal POS Kasir",
          desc: "Pilih menu pesanan pelanggan (Ayam Renyah, Burger, Paket Combo). Pilih tipe pesanan (Dine In / Take Away), dan proses pembayaran (Tunai / QRIS / Kartu).",
          actionText: "Buka Terminal POS",
          actionUrl: "/resto/pos",
          icon: ShoppingBag,
          tag: "Penjualan",
        },
        {
          num: 4,
          time: "Setiap Transaksi Selesai",
          title: "Cetak Struk Pembayaran & Teruskan ke Dapur",
          desc: "Cetak nota struk resmi untuk pelanggan dan pastikan tiket pesanan segera dipersiapkan oleh tim dapur.",
          actionText: "Riwayat Transaksi Kasir",
          actionUrl: "/resto/pos/riwayat",
          icon: Receipt,
          tag: "Struk",
        },
        {
          num: 5,
          time: "Akhir Shift (21:15 WIB)",
          title: "Hitung Uang Fisik Kas & Tutup Shift (Settlement)",
          desc: "Hitung total uang fisik tunai di laci kasir, bandingkan dengan rekap sistem. Masukkan catatan jika ada selisih, lalu tutup shift.",
          actionText: "Tutup / Setor Shift Kasir",
          actionUrl: "/resto/pos/shift",
          icon: DollarSign,
          tag: "Tutup Kas",
        },
        {
          num: 6,
          time: "Sebelum Pulang (21:30 WIB)",
          title: "Presensi Pulang (Clock Out)",
          desc: "Lakukan selfie presensi kepulangan di terminal absensi untuk mengakhiri jam kerja resmi hari ini.",
          actionText: "Clock Out Presensi",
          actionUrl: "/resto/absensi",
          icon: CalendarCheck,
          tag: "Presensi Pulang",
        },
      ],
      accessMatrix: [
        { label: "Terminal POS Kasir Cepat", status: "Akses Penuh" },
        { label: "Buka & Tutup Shift Kasir", status: "Akses Mandiri" },
        { label: "Cetak Ulang Struk Pesanan", status: "Akses Shift Ini" },
        { label: "Presensi Wajah & GPS Geofence", status: "Akses Mandiri" },
      ],
    },
    STAFF: {
      title: "Staff Kitchen & Dapur (Back of House)",
      badge: "Kru Dapur & Produksi",
      badgeColor: "bg-emerald-600 text-white",
      description:
        "Tim juru masak dan staf operasional dapur D'Besto. Bertanggung jawab atas kualitas rasa, kebersihan deep fryer, suhu penggorengan standar, penerimaan pasokan bahan mentah, serta penghitungan fisik bahan baku (Stock Opname).",
      dailyGoal: "Menyajikan ayam goreng renyah bumbu meresap sesuai standar mutu halal D'Besto dan stok dapur tertata rapi.",
      steps: [
        {
          num: 1,
          time: "Saat Datang (08:30 WIB)",
          title: "Presensi Wajah Selfie & Validasi Geofence GPS",
          desc: "Buka terminal presensi, pastikan berada di area dapur / resto (< 100m) dan ambil foto selfie verifikasi wajah untuk Clock In.",
          actionText: "Terminal Presensi GPS",
          actionUrl: "/resto/absensi",
          icon: MapPin,
          tag: "Presensi Masuk",
        },
        {
          num: 2,
          time: "Pagi (08:45 WIB)",
          title: "Pengecekan Kesiapan Bahan & Peralatan Dapur",
          desc: "Periksa minyak goreng, suhu deep fryer (standar 170°C), ketersediaan ayam marinasi, tepung bumbu renyah, dan bumbu sadas.",
          actionText: "Dashboard Operasional",
          actionUrl: "/admin",
          icon: UtensilsCrossed,
          tag: "Preparasi",
        },
        {
          num: 3,
          time: "Jam Operasional (09:00 - 21:00 WIB)",
          title: "Pengolahan & Penggorengan Sesuai SOP Standar",
          desc: "Goreng ayam selama 12-14 menit hingga keemasan sempurna, celupkan ke saus pedas sadas sesuai pesanan, dan jaga kebersihan meja saji.",
          actionText: "Standar SOP Mutu",
          actionUrl: "/admin",
          icon: ShieldCheck,
          tag: "Produksi",
        },
        {
          num: 4,
          time: "Sore (15:00 WIB / Saat Pasokan Tiba)",
          title: "Cek Fisik & Bongkar Muatan Bahan Baku",
          desc: "Bantu Store Manager menghitung fisik kemasan ayam potong dan bumbu yang datang dari logistik gudang pusat.",
          actionText: "Riwayat PO Pasokan",
          actionUrl: "/resto/po-bahan-baku/riwayat",
          icon: Package,
          tag: "Penerimaan",
        },
        {
          num: 5,
          time: "Malam (21:00 WIB / Closing)",
          title: "Penghitungan Stok Fisik (Stock Opname Dapur)",
          desc: "Hitung fisik sisa bahan di cold storage (ayam potong, tepung, minyak, packaging) dan input angka fisik ke form Stock Opname.",
          actionText: "Form Stock Opname Dapur",
          actionUrl: "/resto/stock-opname",
          icon: ClipboardList,
          tag: "Hitung Fisik",
        },
        {
          num: 6,
          time: "Sebelum Pulang (21:30 WIB)",
          title: "Pembersihan Area Dapur & Clock Out Presensi",
          desc: "Saring sisa minyak goreng, bersihkan deep fryer, matikan gas, dan lakukan selfie Clock Out di terminal absensi.",
          actionText: "Clock Out Presensi",
          actionUrl: "/resto/absensi",
          icon: CalendarCheck,
          tag: "Presensi Pulang",
        },
      ],
      accessMatrix: [
        { label: "Presensi Selfie Wajah & Geofence", status: "Akses Mandiri" },
        { label: "Input Hitung Stock Opname Dapur", status: "Akses Input" },
        { label: "Monitoring Stok Bahan Baku Cabang", status: "Akses Baca" },
      ],
    },
    PUBLIC: {
      title: "Public / Pelanggan & Calon Mitra",
      badge: "Pelanggan & Mitra",
      badgeColor: "bg-amber-400 text-zinc-950",
      description:
        "Pengunjung website publik D'Besto Indonesia. Terdiri dari konsumen penikmat kuliner ayam krispi yang ingin melihat promo menu atau mencari outlet terdekat, serta calon wirausahawan yang ingin mendaftar kemitraan waralaba (franchise).",
      dailyGoal: "Menemukan menu favorit, memanfaatkan promo diskon, dan mendapatkan informasi kemitraan usaha secara transparan.",
      steps: [
        {
          num: 1,
          time: "Eksplorasi Brand",
          title: "Mengenal Keunggulan & Kualitas Ayam D'Besto",
          desc: "Pelajari sejarah cita rasa rempah khas, jaminan 100% Halal MUI, dan komitmen mutu sajian ayam krispi favorit keluarga Indonesia.",
          actionText: "Halaman Tentang Kami",
          actionUrl: "/tentang-kami",
          icon: ShieldCheck,
          tag: "Brand Profile",
        },
        {
          num: 2,
          time: "Pilihan Menu",
          title: "Jelajahi Varian Menu Renyah & Lezat",
          desc: "Lihat katalog lengkap: Ayam Sadas pedas legendaris, Ayam Renyah Crispy, Burger Clik, French Fries, dan Paket Hemat Bento.",
          actionText: "Lihat Katalog Menu",
          actionUrl: "/menu",
          icon: UtensilsCrossed,
          tag: "Katalog",
        },
        {
          num: 3,
          time: "Kupon Hemat",
          title: "Cek Promo Diskon & Kode Kupon Menarik",
          desc: "Dapatkan penawaran promo bundle spesial, diskon tanggal gajian, dan cashback pembayaran digital yang sedang berlaku.",
          actionText: "Cek Promo Terkini",
          actionUrl: "/promo",
          icon: Sparkles,
          tag: "Promo",
        },
        {
          num: 4,
          time: "Kunjungi Outlet",
          title: "Cari Lokasi Cabang D'Besto Terdekat",
          desc: "Temukan alamat cabang resto, jam operasional buka, peta rute lokasi, dan nomor kontak cabang di sekitar Anda.",
          actionText: "Daftar Lokasi Cabang",
          actionUrl: "/outlet",
          icon: MapPin,
          tag: "Outlet Locator",
        },
        {
          num: 5,
          time: "Kemitraan Usaha",
          title: "Daftar Kemitraan Franchise Waralaba",
          desc: "Isi formulir pengajuan kemitraan franchise D'Besto secara online untuk memulai bisnis kuliner menguntungkan dengan dukungan penuh HQ.",
          actionText: "Formulir Kemitraan",
          actionUrl: "/kemitraan",
          icon: Users,
          tag: "Franchise",
        },
      ],
      accessMatrix: [
        { label: "Katalog Menu & Rincian Harga", status: "Publik Terbuka" },
        { label: "Informasi Promo & Banner", status: "Publik Terbuka" },
        { label: "Pencari Cabang & Peta Rute", status: "Publik Terbuka" },
        { label: "Pengajuan Kemitraan Franchise", status: "Publik Terbuka" },
      ],
    },
  };

  const currentRoleData = rolesData[activeRole];

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden font-sans">
      {/* Top Banner / Role Switcher Header */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                PANDUAN & SOP FLOW BISNIS RESTO
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Alur Proses Bisnis & Panduan Peran (Role Workflow)
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Pilih peran di bawah ini untuk melihat alur kerja harian step-by-step, tanggung jawab, hak akses menu, dan pintasan langsung ke modul aplikasi.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-700/80">
            <span className="text-[11px] font-bold text-zinc-400 px-2">Peran Ditinjau:</span>
            <span className={`text-xs px-2.5 py-1 rounded-xl font-black ${currentRoleData.badgeColor}`}>
              {currentRoleData.badge}
            </span>
          </div>
        </div>

        {/* 5-Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveRole("SUPER_ADMIN")}
            className={`p-3 rounded-2xl text-left transition flex flex-col gap-1 cursor-pointer border ${
              activeRole === "SUPER_ADMIN"
                ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-4 h-4 ${activeRole === "SUPER_ADMIN" ? "text-amber-400" : "text-zinc-500"}`} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 font-bold">HQ</span>
            </div>
            <span className="text-xs font-black">Super Admin</span>
            <span className="text-[10px] text-zinc-400 line-clamp-1">Manajemen Pusat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("RESTO_ADMIN")}
            className={`p-3 rounded-2xl text-left transition flex flex-col gap-1 cursor-pointer border ${
              activeRole === "RESTO_ADMIN"
                ? "bg-blue-600/20 border-blue-400 text-white shadow-md shadow-blue-500/10"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <Store className={`w-4 h-4 ${activeRole === "RESTO_ADMIN" ? "text-blue-400" : "text-zinc-500"}`} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 font-bold">CABANG</span>
            </div>
            <span className="text-xs font-black">Store Manager</span>
            <span className="text-[10px] text-zinc-400 line-clamp-1">Resto Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("CASHIER")}
            className={`p-3 rounded-2xl text-left transition flex flex-col gap-1 cursor-pointer border ${
              activeRole === "CASHIER"
                ? "bg-red-600/20 border-red-400 text-white shadow-md shadow-red-500/10"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <ShoppingBag className={`w-4 h-4 ${activeRole === "CASHIER" ? "text-red-400" : "text-zinc-500"}`} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 font-bold">FRONT</span>
            </div>
            <span className="text-xs font-black">Kasir (Cashier)</span>
            <span className="text-[10px] text-zinc-400 line-clamp-1">Terminal POS & Shift</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("STAFF")}
            className={`p-3 rounded-2xl text-left transition flex flex-col gap-1 cursor-pointer border ${
              activeRole === "STAFF"
                ? "bg-emerald-600/20 border-emerald-400 text-white shadow-md shadow-emerald-500/10"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <UtensilsCrossed className={`w-4 h-4 ${activeRole === "STAFF" ? "text-emerald-400" : "text-zinc-500"}`} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 font-bold">DAPUR</span>
            </div>
            <span className="text-xs font-black">Kitchen Staff</span>
            <span className="text-[10px] text-zinc-400 line-clamp-1">Produksi & Opname</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("PUBLIC")}
            className={`p-3 rounded-2xl text-left transition flex flex-col gap-1 cursor-pointer border ${
              activeRole === "PUBLIC"
                ? "bg-amber-400/20 border-amber-300 text-white shadow-md shadow-amber-400/10"
                : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className={`w-4 h-4 ${activeRole === "PUBLIC" ? "text-amber-300" : "text-zinc-500"}`} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 font-bold">WEB</span>
            </div>
            <span className="text-xs font-black">Publik & Mitra</span>
            <span className="text-[10px] text-zinc-400 line-clamp-1">Pelanggan & Franchise</span>
          </button>
        </div>
      </div>

      {/* Role Profile & Goal Card */}
      <div className="p-6 bg-zinc-50 border-b border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-black text-zinc-900">{currentRoleData.title}</h4>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${currentRoleData.badgeColor}`}>
                {currentRoleData.badge}
              </span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">{currentRoleData.description}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              🎯 TARGET UTAMA HARIAN:
            </span>
            <p className="text-xs font-black text-zinc-900 leading-snug">
              {currentRoleData.dailyGoal}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Workflow */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D32323]" />
              <span>Alur Kerja Harian Step-by-Step (SOP Kronologis)</span>
            </h4>
            <p className="text-xs text-zinc-500">
              Ikuti urutan langkah di bawah ini untuk menyelesaikan tugas harian Anda secara teratur dan tanpa kebingungan.
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-xl">
            {currentRoleData.steps.length} Langkah SOP
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {currentRoleData.steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-4 rounded-2xl border border-zinc-200 hover:border-red-300 bg-white hover:bg-red-50/20 transition-all duration-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 group-hover:bg-red-100 text-zinc-800 group-hover:text-[#D32323] font-black flex items-center justify-center shrink-0 transition text-sm">
                    {step.num}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                        {step.time}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {step.tag}
                      </span>
                      <h5 className="text-sm font-black text-zinc-900 group-hover:text-[#D32323] transition">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">{step.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <Link
                    href={step.actionUrl}
                    onClick={onNavigate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-[#D32323] text-white font-bold text-xs transition shadow-xs group-hover:shadow-md cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Rights Matrix */}
      <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-3">
        <h5 className="text-xs font-black text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-zinc-500" />
          <span>Matriks Hak Akses & Kewenangan Peran Ini</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {currentRoleData.accessMatrix.map((acc, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs"
            >
              <span className="font-medium text-zinc-700">{acc.label}</span>
              <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {acc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
