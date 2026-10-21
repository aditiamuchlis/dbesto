# Prompt Pengembangan Website Brand & Sistem Operasional Multi-Resto D'Besto

## 1. Peran dan Tujuan

Bertindaklah sebagai **Senior Full-Stack Engineer, Enterprise Solutions Architect, dan UI/UX Designer**. Bangun ekosistem terpadu untuk brand restoran cepat saji **D'Besto** yang mencakup dua pilar utama:

1.  **Website Publik & Brand Portal:** Etalase resmi D'Besto yang menggugah selera, responsif, modern, dan dilengkapi katalog menu, promo, kemitraan, berita, dan pemesanan online berbasis pemilihan outlet terdekat. Tampilan beranda mengacu pada referensi visual resmi (`landing_page_sample.png`).
2.  **Sistem Operasional Multi-Resto (ERP & POS Outlet):** Platform manajemen restoran multi-cabang terintegrasi yang mencakup modul Point of Sales (POS), Stock Opname bahan baku, Purchase Order (PO) bahan baku, dan Absensi karyawan berbasis radius geofencing per resto.
3.  **Super Admin Central Hub:** Pusat komando kantor pusat (HQ) untuk mengelola data cabang resto, membuat akun khusus staf per resto, memantau laporan pemasukan/omzet per resto secara real-time, mengaudit selisih stok, memvalidasi pengadaan bahan baku, dan mengontrol kedisiplinan absensi karyawan.

Bangun aplikasi ini menggunakan **Next.js (App Router), TypeScript, Prisma ORM, PostgreSQL, Tailwind CSS, shadcn/ui, Zod**, dan teknologi modern pendukung lainnya.

---

## 2. Arsitektur dan Teknologi

Gunakan stack teknologi modern dan handal berikut:

-   **Framework:** Next.js (App Router) dengan TypeScript penuh (strict mode).
-   **UI & Styling:** React, Tailwind CSS, dan komponen shadcn/ui (Radix UI).
-   **Database:** PostgreSQL.
-   **ORM:** Prisma dengan schema yang dinormalisasi, indeks optimal, dan relasi multi-outlet yang aman.
-   **Validasi:** Zod untuk validasi skema form client-side, Server Actions/API payloads, query parameters, dan environment variables.
-   **Form Management:** React Hook Form dengan `@hookform/resolvers/zod`.
-   **Iconography:** Lucide React.
-   **Visualisasi & Grafik:** Recharts untuk analitik pendapatan, performa penjualan per resto, dan tren inventaris.
-   **Autentikasi & Autorisasi:** Solusi auth modern (Auth.js / JWT cookie berbasis HTTP-Only) dengan **Role-Based Access Control (RBAC)** dan **Multi-Tenant Data Segregation** berbasis `outletId`.
-   **Pencetakan Struk POS:** Integrasi cetak struk thermal via Web Print API (kompatibel kertas 58mm / 80mm) dan invoice digital.
-   **Absensi Geolocation:** HTML5 Geolocation API dengan validasi radius lingkaran (Haversine formula) di sisi server untuk mencegah fake GPS / clock-in di luar resto.
-   **Pengelolaan Gambar:** `next/image` dengan kompresi otomatis, responsif, dan fallback placeholder lokal.
-   **Deployment & Performance:** Dioptimalkan untuk server Node.js di Linux, reverse proxy Nginx, dan database pooling.

---

## 3. Struktur Peran & Hak Akses (RBAC & Multi-Tenant)

Sistem menerapkan isolasi data ketat agar setiap resto hanya dapat mengakses operasional cabangnya sendiri, sementara Super Admin memiliki visibilitas penuh:

| Peran (Role) | Ruang Lingkup | Hak Akses Utama |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** (HQ Central) | Seluruh Cabang (Global) | <ul><li>Kelola data master outlet/resto (tambah, edit, nonaktifkan cabang, atur koordinat GPS).</li><li>Buat dan kelola akun pengguna untuk seluruh cabang (Admin Resto, Kasir, Staf).</li><li>Akses Laporan Pemasukan & Omzet Konsolidasi serta per resto (grafik, rincian pembayaran, AOV).</li><li>Akses Laporan POS, Laporan Stock Opname, Laporan PO Bahan Baku, dan Laporan Absensi seluruh resto.</li><li>Approval PO Bahan Baku dari cabang.</li><li>Kelola konten website publik (CMS Menu, Promo, Berita, Kemitraan, Site Settings).</li></ul> |
| **`RESTO_ADMIN`** (Manager Cabang) | Terisolasi pada 1 Cabang (`outletId`) | <ul><li>Kelola operasional harian cabang terkait.</li><li>Akses laporan harian cabang: rekap penjualan kasir, ringkasan shift kasir.</li><li>Audit dan approval hasil Stock Opname cabang.</li><li>Membuat pengajuan PO Bahan Baku ke pusat & input penerimaan barang (Goods Receipt).</li><li>Memantau dan menyetujui absensi serta rekap kehadiran staf cabang.</li><li>Mengatur status stok ketersediaan menu cabang (buka/tutup menu habis di POS).</li></ul> |
| **`CASHIER`** (Kasir Resto) | Terisolasi pada 1 Cabang (`outletId`) | <ul><li>Buka dan tutup shift kasir (*cash drawer reconciliation*: uang kas awal vs uang kas akhir).</li><li>Menjalankan transaksi POS cepat (Dine-in, Takeaway, Online delivery partner).</li><li>Proses pembayaran (Tunai, QRIS, Debit) dan cetak struk thermal / nota WhatsApp.</li><li>Void transaksi (dengan otorisasi Resto Admin/PIN).</li><li>Melihat riwayat transaksi shift berjalan.</li></ul> |
| **`STAFF`** (Karyawan Cabang) | Terisolasi pada 1 Cabang (`outletId`) | <ul><li>Melakukan Absensi Masuk (Clock-in) dan Absensi Pulang (Clock-out) harian.</li><li>Validasi kehadiran menggunakan verifikasi lokasi GPS resto & foto selfie.</li><li>Melihat riwayat absensi pribadi dan jadwal shift kerja.</li><li>Membantu proses penghitungan fisik pada modul Stock Opname jika ditugaskan.</li></ul> |

---

## 4. Arahan Visual & Desain Antarmuka

### A. Website Publik D'Besto
Mengacu persis pada identitas visual resmi pada `landing_page_sample.png`:
-   **Warna Utama:** Merah D'Besto (`#D32323` / `#C4121A`) untuk tombol utama, badge, dan aksen dinamis.
-   **Warna Pendukung:** Kuning keemasan (`#FFC107` / `#F59E0B`), krem hangat (`#FFFDF7`), dan putih bersih.
-   **Latar Belakang:** Bersih, terang, dipadukan dengan foto produk resolusi tinggi yang menggugah selera (*hero banner* ayam krispi, nasi pulen, sambal, minuman segar).
-   **Tipografi:** Font sans-serif modern (Inter / Outfit / Plus Jakarta Sans) yang tegas, ramah keluarga, dan mudah dibaca.
-   **Header & Navigasi:** Logo D'Besto di kiri, menu navigasi (*Home, Menu, Promo, Kemitraan, Berita, Tentang Kami, Lokasi Outlet*), ikon pencarian & keranjang, serta tombol CTA merah "Pesan Sekarang".

### B. Antarmuka POS Kasir (Touch-Friendly & High Efficiency)
-   Didesain khusus untuk layar tablet dan monitor kasir layar sentuh.
-   Layout 2 kolom: Grid katalog produk di sebelah kiri (dengan tab kategori, pencarian cepat, kartu menu bergambar dengan penanda harga jelas) dan Ringkasan Order (Cart/Struk) di sebelah kanan.
-   Modal pembayaran instan dengan kalkulator nominal uang tunai cepat (pecahan pas, 50k, 100k, kembalian otomatis), QRIS dinamis, dan kartu debit.
-   Tombol aksi cepat: Cetak Struk, Buka Laci Kas (Cash Drawer), Hold Order, Void.

### C. Dashboard Super Admin & Resto Manager
-   Tema visual profesional: Sidebar gelap atau abu-abu netral dengan aksen merah D'Besto.
-   Kartu ringkasan metrik (KPI Cards): Total Omzet Hari Ini, Total Transaksi, Resto Terlaris, Jumlah PO Pending, Kehadiran Staf Hari Ini.
-   Komponen filter global: Dropdown "Pilih Resto" (menampilkan seluruh cabang untuk Super Admin, atau terkunci pada cabangnya untuk Resto Admin) dan pemilih rentang tanggal (Hari Ini, 7 Hari, Bulan Ini, Custom).
-   Tabel data interaktif dengan fitur pagination, pencarian, badge status berwarna, dan tombol aksi "Export Excel / PDF".

---

## 5. Halaman yang Dibangun

### Halaman Publik (Customer Facing)
-   `/` --- Beranda brand sesuai `landing_page_sample.png`.
-   `/menu` --- Katalog menu dengan filter kategori, pencarian, dan penanda harga.
-   `/menu/[slug]` --- Detail produk (deskripsi, varian, nilai gizi, rekomendasi menu).
-   `/outlet` --- Daftar cabang restoran D'Besto dengan fitur pencarian kota/lokasi terdekat dan jam buka.
-   `/promo` --- Daftar promo aktif dan kupon diskon.
-   `/kemitraan` --- Info kemitraan franchise dan formulir aplikasi calon mitra.
-   `/berita` & `/berita/[slug]` --- Berita perusahaan, artikel kuliner, dan event D'Besto.
-   `/tentang-kami` --- Profil brand, nilai perusahaan, kehalalan, dan komitmen mutu.
-   `/keranjang` & `/checkout` --- Pemesanan online dengan memilih outlet pengiriman/pengambilan terdekat.
-   `/kontak` --- Informasi kontak pusat dan form saran/masukan.

### Halaman Autentikasi
-   `/auth/login` --- Portal login terpadu (mengarahkan otomatis ke dashboard Super Admin atau Portal Resto berdasarkan role).

### Halaman Portal Operasional Resto (`/resto/...`)
*Dikhususkan untuk Resto Admin, Kasir, dan Staf pada cabang masing-masing:*
-   `/resto/pos` --- Aplikasi Kasir POS (pemilihan menu, keranjang, kalkulasi pajak/diskon, pembayaran, cetak struk).
-   `/resto/pos/shift` --- Manajemen shift kasir (buka laci kas, serah terima shift, tutup kasir, selisih kas).
-   `/resto/pos/riwayat` --- Daftar struk transaksi harian cabang dan cetak ulang struk.
-   `/resto/stock-opname` --- Form input stock opname bahan baku per shift/harian (stok fisik vs stok sistem).
-   `/resto/stock-opname/riwayat` --- Log riwayat stock opname cabang dan status persetujuan.
-   `/resto/po-bahan-baku` --- Buat pengajuan PO Bahan Baku ke gudang pusat/supplier.
-   `/resto/po-bahan-baku/riwayat` --- Status pengiriman PO bahan baku dan form penerimaan barang (Goods Receipt).
-   `/resto/absensi` --- Terminal absensi staf (Clock-in / Clock-out) dengan deteksi lokasi GPS dan kamera selfie.
-   `/resto/absensi/riwayat` --- Rekap riwayat absensi staf cabang dan jadwal shift kerja.
-   `/resto/laporan` --- Laporan harian cabang (penjualan kasir, ringkasan pemakaian bahan baku).

### Halaman Super Admin Central Hub (`/admin/...`)
*Dikhususkan untuk Super Admin HQ:*
-   `/admin` --- Executive Dashboard (grafik omzet konsolidasi seluruh resto, perbandingan performa cabang).
-   `/admin/outlets` --- Manajemen Master Resto (CRUD cabang, kode outlet, alamat, pin koordinat GPS geofence, jam buka, status aktif).
-   `/admin/outlets/[id]` --- Detail cabang: data performa, daftar staf, inventaris, dan riwayat pesanan.
-   `/admin/users` --- Manajemen Akun Staf (buat akun baru, atur role: Admin Resto/Kasir/Staf, asosiasi cabang).
-   `/admin/laporan/pemasukan` --- **Laporan Pendapatan**: filter per cabang/periode, omzet kotor, omzet bersih, metode bayar (Tunai vs QRIS vs Kartu), tren penjualan, ekspor data.
-   `/admin/laporan/pos` --- **Laporan Transaksi POS**: rincian seluruh tiket transaksi, void audit, menu terlaris per cabang.
-   `/admin/laporan/stock-opname` --- **Laporan Stock Opname**: audit variansi selisih fisik vs sistem, nilai kerugian selisih (Rp), approval penyesuaian stok.
-   `/admin/laporan/po-bahan-baku` --- **Laporan Pengadaan Bahan Baku**: daftar pengajuan PO dari seluruh resto, modal belanja bahan baku per cabang, approval PO.
-   `/admin/laporan/absensi` --- **Laporan Absensi Karyawan**: tingkat kehadiran per cabang, keterlambatan, staf alpa/izin, audit koordinat GPS.
-   `/admin/master/bahan-baku` --- Master Data Bahan Baku (nama bahan, satuan: kg/gram/liter/pcs, harga acuan, stok minimum).
-   `/admin/menu` --- Master Data Menu Katalog Produk & Kategori.
-   `/admin/promo` --- Manajemen Promo & Banner.
-   `/admin/berita` --- Manajemen Artikel Berita D'Besto.
-   `/admin/kemitraan` --- Manajemen Pengajuan Calon Mitra Franchise.
-   `/admin/pengaturan` --- Pengaturan Identitas Website, Kontak, Sosmed, Jam Layanan.

---

## 6. Spesifikasi Rinci Modul Operasional Resto

### A. Modul POS (Point of Sales) per Resto
1.  **Shift & Cash Drawer Management:**
    -   Sebelum memulai transaksi, kasir wajib melakukan *Open Shift* dengan memasukkan uang modal awal di kasir (*Opening Cash Float*).
    -   Saat pergantian shift atau tutup toko, kasir melakukan *Close Shift*: sistem meminta kasir menghitung uang fisik di laci kas (*Closing Cash Count*).
    -   Sistem menghitung otomatis selisih kas (*Cash Discrepancy* = Uang Fisik - (Kas Awal + Total Penjualan Tunai)) dan mencatatnya ke laporan audit.
2.  **Operasional Transaksi:**
    -   Dukungan jenis pesanan: *Dine-in* (Makan di Tempat), *Takeaway* (Bungkus), dan *Delivery Online Partner* (GrabFood / GoFood / ShopeeFood).
    -   Pencarian menu instan dengan filter kategori atau barcode/SKU scanner.
    -   Dukungan varian menu (misal: Sayap, Paha Bawah, Dada, Paha Atas, Level Pedas) dan catatan khusus.
    -   Metode Pembayaran: Tunai (dengan tombol cepat uang pas dan kalkulasi kembalian), QRIS (tampilan kode QR dinamis/statis), dan Kartu Debit/Kredit.
    -   Penomoran nota otomatis dan unik per resto: Format `INV-[KODE_RESTO]-[YYYYMMDD]-[NO_URUT]`, contoh: `INV-MRG-20261022-0042`.
3.  **Pencetakan Struk (Receipt Printing):**
    -   Format struk kasir rapi 58mm / 80mm mencantumkan: Logo D'Besto, Nama Cabang & Alamat, Nomor Transaksi, Waktu, Nama Kasir, Rincian Pesanan, Subtotal, Pajak/Diskon, Total, Nominal Bayar, Kembalian, dan Pesan Penutup.
    -   Opsi pengiriman struk digital langsung ke nomor WhatsApp pelanggan.

### B. Modul Stock Opname per Resto
1.  **Pengelolaan Stok Bahan Baku:**
    -   Pencatatan inventaris mencakup bahan mentah (ayam potong karkas, tepung bumbu, bumbu marinasi, minyak goreng, saus sachet, beras) dan barang kemasan (dus ayam, cup minuman, sedotan, plastik take away).
2.  **Proses Input Stock Opname:**
    -   Dilakukan secara berkala (harian saat closing atau mingguan).
    -   Petugas resto menginput jumlah fisik aktual (*Actual Physical Stock*) yang ada di dapur/gudang resto.
    -   Sistem menampilkan jumlah stok teoretis/sistem (*System Recorded Stock*) dan menghitung otomatis selisih kuantitas (*Variance* = Actual - System).
    -   Jika terjadi selisih, sistem menghitung estimasi nilai kerugian dalam Rupiah (*Loss Value* = Variance × Harga Pokok Bahan) dan mewajibkan pengisian alasan (misal: rusak/basi, tumpah, susut penggorengan, salah catat, atau selisih fisik).
3.  **Alur Verifikasi & Audit:**
    -   Draft stock opname diajukan ke Resto Admin dan Super Admin.
    -   Setelah di-*Approve*, sistem melakukan rekonsiliasi otomatis memperbarui saldo stok di sistem menjadi sesuai hasil perhitungan fisik.

### C. Modul PO Bahan Baku (Purchase Order) per Resto
1.  **Pembuatan Pengajuan PO:**
    -   Resto Admin membuat formulir Purchase Order untuk meminta pasokan bahan baku dari Gudang Pusat (HQ) atau supplier resmi D'Besto.
    -   Memilih daftar bahan baku, jumlah kebutuhan, satuan acuan, dan tanggal kebutuhan kedatangan.
2.  **Siklus Status PO:**
    -   `DRAFT` -> `SUBMITTED` (Diajukan oleh resto).
    -   `APPROVED_BY_HQ` / `REJECTED` (Diverifikasi oleh Super Admin kantor pusat).
    -   `IN_DELIVERY` (Bahan baku dalam proses pengiriman dengan nomor resi/surat jalan).
    -   `RECEIVED` (Barang telah tiba dan diterima oleh resto).
3.  **Penerimaan Barang (Goods Receipt):**
    -   Petugas resto memeriksa kesesuaian barang yang tiba dengan PO.
    -   Menginput kuantitas barang yang diterima dalam kondisi baik, jumlah rusak/tolak (jika ada), catatan kondisi, dan mengunggah foto bukti surat jalan/barang.
    -   Setelah tombol "Konfirmasi Penerimaan" ditekan, stok bahan baku di resto otomatis bertambah sesuai jumlah yang diterima.

### D. Modul Absensi Staf per Resto
1.  **Presensi Berbasis Geofencing:**
    -   Setiap cabang resto memiliki titik koordinat GPS terdaftar (`latitude`, `longitude`) dan batas radius toleransi (default: 50 - 100 meter).
    -   Staf melakukan Clock-in (Masuk) dan Clock-out (Pulang) melalui perangkat ponsel atau terminal resto.
    -   Sistem memvalidasi jarak koordinat staf saat tombol ditekan menggunakan formula Haversine. Jika berada di luar radius resto, absensi ditolak secara tegas.
2.  **Bukti Kehadiran:**
    -   Karyawan mengambil foto selfie real-time saat clock-in/out sebagai bukti verifikasi wajah di lokasi kerja.
3.  **Status & Kedisiplinan:**
    -   Sistem mencocokkan waktu absen dengan jadwal shift kerja staf.
    -   Status tercatat otomatis: `HADIR` (tepat waktu), `TERLAMBAT` (dengan kalkulasi durasi menit keterlambatan), `PULANG_CEPAT`, `IZIN`, `SAKIT`, atau `ALPA`.
    -   Resto Admin dan Super Admin dapat melihat rekap absensi harian dan bulanan untuk dasar evaluasi dan penggajian.

### E. Modul Super Admin: Multi-Outlet Control & Konsolidasi Laporan
1.  **Pusat Manajemen Cabang (Outlet Management):**
    -   Tambah outlet baru: Masukkan Nama Cabang (misal: "D'Besto Margonda Raya"), Kode Resto Unik (misal: "MRG01"), Alamat, Kota, Nomor Telepon Outlet, Koordinat GPS (Latitude/Longitude), Radius Geofence (meter), Jam Buka/Tutup, dan Target Omzet Bulanan.
    -   Buat Akun Karyawan Resto: Tambahkan akun login untuk Admin Resto, Kasir, atau Staf Dapur dan tautkan langsung ke `outletId`.
2.  **Laporan Pemasukan & Keuangan Konsolidasi:**
    -   Tampilan ringkasan total omzet seluruh jaringan resto dengan visual grafik garis/batang (harian, mingguan, bulanan, tahunan).
    -   Filter instan per resto: Pilih satu resto tertentu untuk melihat performa spesifik cabang tersebut.
    -   Metrik keuangan: Total Penjualan Kotor (Gross Sales), Total Diskon/Promo, Penjualan Bersih (Net Revenue), Rata-rata Nilai Transaksi (*Average Order Value*), dan Total Nilai Pengeluaran Bahan Baku (Total PO Cabang).
    -   Komposisi metode pembayaran: Diagram proporsi transaksi Tunai vs QRIS vs Kartu Debit.
    -   Daftar menu terlaris (*Top Selling Products*) per resto dan secara keseluruhan.
    -   Kemampuan ekspor laporan lengkap ke format Microsoft Excel (.xlsx), CSV, dan PDF siap cetak.

---

## 7. Skema Database Prisma (PostgreSQL)

Berikut adalah skema data relasional Prisma yang komprehensif, dinormalisasi, dan mendukung multi-tenant:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------------------
// ENUMS
// ----------------------------------------------------
enum UserRole {
  SUPER_ADMIN
  RESTO_ADMIN
  CASHIER
  STAFF
}

enum OrderType {
  DINE_IN
  TAKEAWAY
  DELIVERY_ONLINE
}

enum PaymentMethod {
  CASH
  QRIS
  DEBIT_CARD
  CREDIT_CARD
  TRANSFER
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}

enum ShiftStatus {
  OPEN
  CLOSED
}

enum PoStatus {
  DRAFT
  SUBMITTED
  APPROVED_BY_HQ
  REJECTED
  IN_DELIVERY
  RECEIVED
  CANCELLED
}

enum AttendanceStatus {
  PRESENT
  LATE
  EARLY_LEAVE
  PERMIT
  SICK
  ABSENT
}

enum StockOpnameStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
}

// ----------------------------------------------------
// OUTLET / RESTO (MULTI-TENANT CORE)
// ----------------------------------------------------
model Outlet {
  id              String      @id @default(cuid())
  code            String      @unique // Contoh: "MRG01", "FTM02"
  name            String      // Contoh: "D'Besto Margonda"
  slug            String      @unique
  address         String
  city            String
  phone           String?
  latitude        Float       // Titik koordinat GPS
  longitude       Float       // Titik koordinat GPS
  radiusMeters    Int         @default(100) // Radius batas absensi
  openingTime     String?     @default("09:00")
  closingTime     String?     @default("21:30")
  monthlyTarget   Decimal?    @default(0) @db.Decimal(15, 2)
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  users           User[]
  cashierShifts   CashierShift[]
  posOrders       PosOrder[]
  materialStocks  OutletMaterialStock[]
  stockOpnames    StockOpname[]
  purchaseOrders  PurchaseOrder[]
  attendances     Attendance[]

  @@index([city])
  @@index([isActive])
}

// ----------------------------------------------------
// PENGGUNA & AUTENTIKASI
// ----------------------------------------------------
model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String
  passwordHash  String
  phone         String?
  role          UserRole     @default(STAFF)
  isActive      Boolean      @default(true)
  outletId      String?      // Null untuk SUPER_ADMIN, wajib terisi untuk staf cabang
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  outlet        Outlet?      @relation(fields: [outletId], references: [id], onDelete: Cascade)
  shifts        CashierShift[]
  posOrders     PosOrder[]
  attendances   Attendance[]
  createdPos    PurchaseOrder[] @relation("PoCreator")
  opnames       StockOpname[]   @relation("OpnameCreator")

  @@index([outletId])
  @@index([role])
}

// ----------------------------------------------------
// MASTER PRODUK & KATALOG MENU WEBSITE/POS
// ----------------------------------------------------
model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  products    Product[]
}

model Product {
  id          String        @id @default(cuid())
  categoryId  String
  name        String
  slug        String        @unique
  description String?
  price       Int           // Harga dalam Rupiah (integer)
  image       String?
  isAvailable Boolean       @default(true)
  isActive    Boolean       @default(true)
  sortOrder   Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  category    Category      @relation(fields: [categoryId], references: [id])
  orderItems  PosOrderItem[]

  @@index([categoryId])
  @@index([isActive, isAvailable])
}

// ----------------------------------------------------
// TRANSAKSI POS & KASIR PER RESTO
// ----------------------------------------------------
model CashierShift {
  id              String       @id @default(cuid())
  outletId        String
  userId          String       // Kasir
  openedAt        DateTime     @default(now())
  closedAt        DateTime?
  openingCash     Decimal      @db.Decimal(12, 2)
  closingCash     Decimal?     @db.Decimal(12, 2)
  expectedCash    Decimal?     @db.Decimal(12, 2) // Kas awal + Penjualan tunai
  cashDiscrepancy Decimal?     @db.Decimal(12, 2) // Selisih kas
  notes           String?
  status          ShiftStatus  @default(OPEN)
  createdAt       DateTime     @default(now())

  outlet          Outlet       @relation(fields: [outletId], references: [id], onDelete: Cascade)
  user            User         @relation(fields: [userId], references: [id])
  orders          PosOrder[]

  @@index([outletId, status])
}

model PosOrder {
  id              String        @id @default(cuid())
  invoiceNumber   String        @unique // e.g., "INV-MRG-20261022-0001"
  outletId        String
  shiftId         String?
  cashierId       String
  orderType       OrderType     @default(DINE_IN)
  customerName    String?       @default("Pelanggan D'Besto")
  customerPhone   String?
  subtotal        Int
  discountAmount  Int           @default(0)
  taxAmount       Int           @default(0)
  totalAmount     Int           // Net revenue
  paidAmount      Int           // Uang diserahkan
  changeAmount    Int           @default(0) // Kembalian
  paymentMethod   PaymentMethod @default(CASH)
  paymentStatus   PaymentStatus @default(PAID)
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  outlet          Outlet        @relation(fields: [outletId], references: [id], onDelete: Cascade)
  shift           CashierShift? @relation(fields: [shiftId], references: [id])
  cashier         User          @relation(fields: [cashierId], references: [id])
  items           PosOrderItem[]

  @@index([outletId, createdAt])
  @@index([paymentStatus])
  @@index([invoiceNumber])
}

model PosOrderItem {
  id          String    @id @default(cuid())
  orderId     String
  productId   String
  productName String    // Snapshot nama saat transaksi
  unitPrice   Int       // Snapshot harga satuan saat transaksi
  quantity    Int
  subtotal    Int
  notes       String?

  order       PosOrder  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product   @relation(fields: [productId], references: [id])

  @@index([orderId])
}

// ----------------------------------------------------
// MANAJEMEN BAHAN BAKU & STOK OUTLET
// ----------------------------------------------------
model RawMaterial {
  id              String        @id @default(cuid())
  code            String        @unique // e.g. "MAT-AYAM-01"
  name            String        // e.g. "Ayam Potong Marinasi"
  unit            String        // "kg", "gram", "pcs", "pack", "liter"
  standardCost    Decimal       @default(0) @db.Decimal(12, 2)
  minStockAlert   Float         @default(10)
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  outletStocks    OutletMaterialStock[]
  poItems         PurchaseOrderItem[]
  opnameItems     StockOpnameItem[]
}

model OutletMaterialStock {
  id            String       @id @default(cuid())
  outletId      String
  materialId    String
  currentStock  Float        @default(0) // Stok real-time di resto
  updatedAt     DateTime     @updatedAt

  outlet        Outlet       @relation(fields: [outletId], references: [id], onDelete: Cascade)
  material      RawMaterial  @relation(fields: [materialId], references: [id], onDelete: Cascade)

  @@unique([outletId, materialId])
  @@index([outletId])
}

// ----------------------------------------------------
// STOCK OPNAME PER RESTO
// ----------------------------------------------------
model StockOpname {
  id              String            @id @default(cuid())
  opnameNumber    String            @unique // e.g., "SO-MRG-20261022-01"
  outletId        String
  createdById     String
  opnameDate      DateTime          @default(now())
  status          StockOpnameStatus @default(SUBMITTED)
  totalLossAmount Decimal           @default(0) @db.Decimal(12, 2) // Total kerugian selisih (Rp)
  notes           String?
  approvedAt      DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  outlet          Outlet            @relation(fields: [outletId], references: [id], onDelete: Cascade)
  createdBy       User              @relation("OpnameCreator", fields: [createdById], references: [id])
  items           StockOpnameItem[]

  @@index([outletId, opnameDate])
}

model StockOpnameItem {
  id            String       @id @default(cuid())
  opnameId      String
  materialId    String
  systemStock   Float        // Stok buku/sistem
  physicalStock Float        // Stok hitung fisik
  difference    Float        // Variance (physical - system)
  costPerUnit   Decimal      @db.Decimal(12, 2)
  lossValue     Decimal      @db.Decimal(12, 2) // difference * costPerUnit
  reason        String?      // e.g., "Basi/expired", "Susut goreng", "Tumpah"

  opname        StockOpname  @relation(fields: [opnameId], references: [id], onDelete: Cascade)
  material      RawMaterial  @relation(fields: [materialId], references: [id])

  @@index([opnameId])
}

// ----------------------------------------------------
// PURCHASE ORDER (PO) BAHAN BAKU PER RESTO
// ----------------------------------------------------
model PurchaseOrder {
  id              String              @id @default(cuid())
  poNumber        String              @unique // e.g., "PO-MRG-20261022-001"
  outletId        String
  createdById     String
  orderDate       DateTime            @default(now())
  deliveryDate    DateTime?
  status          PoStatus            @default(SUBMITTED)
  totalAmount     Decimal             @default(0) @db.Decimal(14, 2)
  notes           String?
  receivedPhoto   String?             // Bukti surat jalan saat barang tiba
  receivedNotes   String?
  receivedAt      DateTime?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  outlet          Outlet              @relation(fields: [outletId], references: [id], onDelete: Cascade)
  createdBy       User                @relation("PoCreator", fields: [createdById], references: [id])
  items           PurchaseOrderItem[]

  @@index([outletId, status])
}

model PurchaseOrderItem {
  id          String        @id @default(cuid())
  poId        String
  materialId  String
  orderedQty  Float
  receivedQty Float?        @default(0)
  unitCost    Decimal       @db.Decimal(12, 2)
  subtotal    Decimal       @db.Decimal(14, 2)

  po          PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  material    RawMaterial   @relation(fields: [materialId], references: [id])

  @@index([poId])
}

// ----------------------------------------------------
// ABSENSI KARYAWAN BERBASIS GEOFENCING PER RESTO
// ----------------------------------------------------
model Attendance {
  id            String           @id @default(cuid())
  outletId      String
  userId        String
  date          DateTime         @db.Date
  clockInTime   DateTime
  clockOutTime  DateTime?
  inLatitude    Float
  inLongitude   Float
  inDistanceM   Float            // Jarak meter dari titik pusat resto
  inPhotoUrl    String?          // Foto selfie saat clock-in
  outLatitude   Float?
  outLongitude  Float?
  outDistanceM  Float?
  outPhotoUrl   String?
  status        AttendanceStatus @default(PRESENT)
  lateMinutes   Int              @default(0) // Menit keterlambatan
  workHours     Float?           @default(0)
  notes         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  outlet        Outlet           @relation(fields: [outletId], references: [id], onDelete: Cascade)
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([outletId, date])
  @@index([userId])
}

// ----------------------------------------------------
// KONTEN WEBSITE PUBLIK (CMS D'BESTO)
// ----------------------------------------------------
model Promotion {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String
  bannerImage String
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Article {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  summary     String
  content     String    @db.Text
  coverImage  String
  isPublished Boolean   @default(true)
  publishedAt DateTime? @default(now())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model PartnershipInquiry {
  id        String   @id @default(cuid())
  fullName  String
  phone     String
  email     String
  city      String
  budget    String?
  notes     String?
  status    String   @default("NEW") // "NEW", "CONTACTED", "FOLLOW_UP", "CLOSED"
  createdAt DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String
  subject   String
  message   String
  status    String   @default("UNREAD")
  createdAt DateTime @default(now())
}

model SiteSetting {
  id               String   @id @default(cuid())
  brandName        String   @default("D'Besto Chicken & Burger")
  tagline          String   @default("Nikmati Menu Favorit D'Besto di Setiap Momen")
  logoUrl          String?
  contactPhone     String   @default("0812-XXXX-XXXX")
  contactEmail     String   @default("info@dbesto.co.id")
  instagramUrl     String?
  tiktokUrl        String?
  youtubeUrl       String?
  headOfficeAddress String?
  updatedAt        DateTime @updatedAt
}
```

---

## 8. Skema Validasi Zod & Kontrak API

Seluruh input form, query parameter, dan payload Server Actions/API wajib divalidasi dengan Zod:

```typescript
// Contoh skema Zod inti:

// 1. Outlet & Cabang
export const outletSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase(),
  name: z.string().min(3).max(100),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(20).max(500).default(100),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  monthlyTarget: z.number().nonnegative().optional(),
  isActive: z.boolean().default(true),
});

// 2. Transaksi POS Kasir
export const posOrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  unitPrice: z.number().int().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().max(200).optional(),
});

export const createPosOrderSchema = z.object({
  outletId: z.string(),
  shiftId: z.string().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY_ONLINE"]),
  customerName: z.string().max(100).default("Pelanggan D'Besto"),
  customerPhone: z.string().optional(),
  items: z.array(posOrderItemSchema).min(1, "Minimal 1 menu dipilih"),
  discountAmount: z.number().int().nonnegative().default(0),
  taxAmount: z.number().int().nonnegative().default(0),
  paidAmount: z.number().int().positive("Nominal bayar wajib diisi"),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER"]),
  notes: z.string().max(300).optional(),
});

// 3. Stock Opname
export const stockOpnameItemInputSchema = z.object({
  materialId: z.string(),
  systemStock: z.number().nonnegative(),
  physicalStock: z.number().nonnegative(),
  reason: z.string().max(255).optional(),
});

export const submitStockOpnameSchema = z.object({
  outletId: z.string(),
  notes: z.string().max(500).optional(),
  items: z.array(stockOpnameItemInputSchema).min(1, "Minimal 1 bahan baku dihitung"),
});

// 4. PO Bahan Baku
export const purchaseOrderItemInputSchema = z.object({
  materialId: z.string(),
  orderedQty: z.number().positive("Jumlah pesanan harus lebih dari 0"),
});

export const createPurchaseOrderSchema = z.object({
  outletId: z.string(),
  deliveryDate: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(purchaseOrderItemInputSchema).min(1, "Minimal 1 item bahan baku"),
});

export const receivePurchaseOrderSchema = z.object({
  poId: z.string(),
  receivedPhoto: z.string().url("Foto surat jalan wajib valid"),
  receivedNotes: z.string().max(500).optional(),
  receivedItems: z.array(z.object({
    materialId: z.string(),
    receivedQty: z.number().nonnegative(),
  })),
});

// 5. Absensi Geofence
export const clockInSchema = z.object({
  outletId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  photoUrl: z.string().optional(),
});
```

---

## 9. Struktur Folder Proyek yang Direkomendasikan

```text
dbesto/
├── prisma/
│   ├── schema.prisma             # Skema komprehensif Multi-Resto ERP & CMS
│   └── seed.ts                   # Seed Super Admin, data cabang resto, akun kasir, bahan baku, & menu
├── public/
│   ├── images/
│   │   ├── hero/                 # Aset foto ayam krispi sesuai landing_page_sample.png
│   │   ├── menu/                 # Foto produk menu D'Besto
│   │   └── logo/                 # Logo resmi D'Besto
├── src/
│   ├── app/
│   │   ├── (public)/             # Halaman Website Publik Brand
│   │   │   ├── page.tsx          # Beranda D'Besto persis referensi visual
│   │   │   ├── menu/             # Katalog Menu
│   │   │   ├── outlet/           # Direktori Resto & Cek Resto Terdekat
│   │   │   ├── promo/            # Halaman Promo
│   │   │   ├── kemitraan/        # Halaman Kemitraan Franchise
│   │   │   ├── berita/           # Berita D'Besto
│   │   │   ├── tentang-kami/     # Cerita Brand D'Besto
│   │   │   └── kontak/           # Kontak & Saran
│   │   ├── auth/
│   │   │   └── login/            # Portal Login Terpadu
│   │   ├── resto/                # PORTAL OPERASIONAL RESTO CABANG
│   │   │   ├── layout.tsx        # Layout Navigasi Kasir & Resto Staff
│   │   │   ├── pos/              # Layar POS Kasir & Transaksi Cepat
│   │   │   ├── pos/shift/        # Buka/Tutup Kasir (Cash Drawer Reconciliation)
│   │   │   ├── stock-opname/     # Form Input Hitung Fisik Bahan Baku
│   │   │   ├── po-bahan-baku/    # Buat PO & Penerimaan Barang Datang
│   │   │   ├── absensi/          # Terminal Absensi GPS Geofencing & Foto
│   │   │   └── laporan/          # Ringkasan Penjualan Harian Cabang
│   │   ├── admin/                # SUPER ADMIN CENTRAL HUB (KANTOR PUSAT)
│   │   │   ├── layout.tsx        # Sidebar & Header Super Admin
│   │   │   ├── page.tsx          # Executive Revenue Dashboard & Grafik
│   │   │   ├── outlets/          # Master Resto: CRUD Cabang & Pin GPS
│   │   │   ├── users/            # Master Pengguna: Akun Kasir, Staf, & Resto Admin
│   │   │   ├── laporan/
│   │   │   │   ├── pemasukan/    # Laporan Omzet Konsolidasi & Filter Resto
│   │   │   │   ├── pos/          # Laporan Tiket Transaksi POS Seluruh Resto
│   │   │   │   ├── stock-opname/ # Laporan Selisih Stok & Audit Nilai Kerugian
│   │   │   │   ├── po-bahan-baku/# Laporan PO & Approval Pengadaan Bahan
│   │   │   │   └── absensi/      # Laporan Kehadiran & Kedisiplinan Staf
│   │   │   ├── master/bahan-baku/# Master Bahan Baku (BOM/Raw Materials)
│   │   │   ├── menu/             # CRUD Katalog Menu & Kategori
│   │   │   ├── promo/            # CRUD Banner & Promo
│   │   │   └── pengaturan/       # Pengaturan Situs Web
│   │   ├── api/                  # Route Handlers untuk cetak struk / webhooks
│   │   ├── globals.css           # Token warna D'Besto, font, utilitas cetak thermal
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                   # Komponen shadcn/ui (Button, Dialog, Table, Badge, dsb.)
│   │   ├── public/               # Komponen Header, Hero, Keunggulan, Footer Website
│   │   ├── pos/                  # Komponen POS: ProductGrid, CartSummary, PaymentModal, StrukThermal
│   │   ├── stock-opname/         # Komponen Tabel Hitung Fisik & Selisih
│   │   ├── po/                   # Komponen Form PO & Checklist Penerimaan Barang
│   │   ├── absensi/              # Komponen GPS Camera Scanner & Geofence Status
│   │   └── admin/                # Komponen Grafik Recharts, OutletSelector, ExportButtons
│   ├── lib/
│   │   ├── db.ts                 # Prisma Client Singleton
│   │   ├── auth.ts               # Konfigurasi Session & Verifikasi Role
│   │   ├── geofence.ts           # Perhitungan Formula Haversine Jarak GPS
│   │   ├── formatters.ts         # Format Rupiah (IDR), Tanggal Indonesia, Nomor Nota
│   │   └── export.ts             # Utilitas Ekspor Excel / CSV / PDF
│   ├── server/                   # Server Actions (POS, Opname, PO, Absensi, Outlets, Users)
│   └── middleware.ts             # Proteksi Route & Isolasi Multi-Tenant
├── .env.example
├── package.json
└── README.md
```

---

## 10. Logika Bisnis Kunci & Aturan Keamanan

### A. Isolasi Data Multi-Tenant (Cabang Resto)
1.  **Server-Side Isolation:** Jangan pernah mempercayai `outletId` yang dikirim dari browser client pada akun ber-role `RESTO_ADMIN`, `CASHIER`, atau `STAFF`. Server Actions/API wajib membaca `session.user.outletId` dari token autentikasi yang terverifikasi.
2.  **Akses Super Admin:** Hanya `SUPER_ADMIN` yang diizinkan menentukan parameter `outletId` secara fleksibel saat meminta data laporan atau melakukan mutasi data antar cabang.
3.  **Audit Trail:** Seluruh pembatalan transaksi (*Void Order*), penyesuaian stok (*Stock Adjustment*), dan revisi jam absensi wajib mencatat ID pengguna yang melakukan otorisasi.

### B. Validasi Radius Geofencing (Formula Haversine)
Server menghitung jarak antara koordinat perangkat karyawan ($lat_1, lon_1$) dengan koordinat cabang resto ($lat_2, lon_2$):
$$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_1)\cos(lat_2)\sin^2\left(\frac{\Delta lon}{2}\right)}\right)$$
Jika $d > \text{outlet.radiusMeters}$, maka request Clock-in/Clock-out langsung dibatalkan dengan pesan: *"Anda berada di luar radius cabang resto (jarak terdeteksi: X meter)"*.

---

## 11. Data Awal (Seed Data) Pengembangan

Sediakan file `prisma/seed.ts` yang siap dijalankan dengan data contoh realistis:
1.  **Akun Super Admin:** Email `superadmin@dbesto.co.id` untuk akses kantor pusat.
2.  **Contoh Cabang Resto:**
    -   *D'Besto Margonda Raya (Depok)* - Kode: `MRG01`
    -   *D'Besto Fatmawati (Jakarta Selatan)* - Kode: `FTM01`
    -   *D'Besto Pajajaran (Bogor)* - Kode: `PJJ01`
3.  **Akun Cabang per Resto:**
    -   Resto Admin: `admin.margonda@dbesto.co.id`
    -   Kasir: `kasir.margonda@dbesto.co.id`
    -   Staf: `staf.margonda@dbesto.co.id`
4.  **Master Bahan Baku:** Ayam Utuh Karkas (kg), Bumbu Marinasi (pack), Tepung Bumbu Crispy (kg), Minyak Goreng (liter), Saus Sambal Sachet (pack), Kemasan Dus D'Besto (pcs), Cup Minuman (pcs).
5.  **Katalog Menu Populer D'Besto:**
    -   Ayam Fried Chicken Original (Dada, Paha Atas, Sayap, Paha Bawah)
    -   Paket Cluck (Ayam + Nasi + Es Teh)
    -   Ayam Saus Lada Hitam (Blackpepper)
    -   Burger D'Besto (Beef & Chicken)
    -   Sosis Bakar & French Fries
6.  **Data Transaksi & Absensi Dummy:** Beberapa riwayat transaksi POS, data stock opname, PO bahan baku, dan riwayat absensi untuk demonstrasi grafik laporan di dashboard Super Admin.

---

## 12. Kriteria Penerimaan & Verifikasi Sistem

Sistem dinyatakan berhasil jika:
1.  **Beranda Publik:** Menampilkan identitas visual D'Besto yang menggugah selera, responsif di mobile/desktop, dan identik dengan `landing_page_sample.png`.
2.  **Manajemen Resto & Akun (Super Admin):** Super Admin dapat menambah cabang resto baru beserta koordinat GPS-nya, serta membuat akun login khusus untuk staf cabang tersebut.
3.  **Laporan Pemasukan (Super Admin):** Super Admin dapat melihat grafik total omzet konsolidasi seluruh resto dan memfilter pendapatan per cabang resto secara akurat.
4.  **Operasional POS (Kasir Resto):** Kasir dapat membuka shift, memilih menu, menyelesaikan transaksi (Tunai/QRIS), mencetak struk thermal, dan menutup shift dengan rekonsiliasi kas.
5.  **Stock Opname (Resto):** Petugas resto dapat menginput stok fisik bahan baku, melihat selisih kuantitas dan nominal kerugian, serta mengajukan rekonsiliasi stok.
6.  **PO Bahan Baku (Resto & Super Admin):** Resto dapat mengajukan PO pasokan bahan baku, Super Admin dapat menyetujui di pusat, dan resto dapat mengonfirmasi penerimaan barang saat tiba.
7.  **Absensi Geofencing (Staf Resto):** Staf resto dapat melakukan Clock-in/Clock-out hanya jika lokasi GPS berada di dalam radius cabang resto yang sah.
8.  **Keamanan & Kualitas:** Kode bebas dari error TypeScript, validasi Zod diterapkan di semua input, dan tidak ada kebocoran data antar cabang resto yang berbeda.
