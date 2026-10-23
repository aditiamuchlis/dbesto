# Daftar Akun Pengguna & Akses Role D'Besto (JWT Authentication)

Dokumen ini berisi daftar lengkap akun resmi untuk masuk ke portal internal **D'Besto Enterprise Platform** menggunakan autentikasi **JSON Web Token (JWT)**.

---

## 🔐 Kredensial Login Akun Resmi

| No | Nama Lengkap | Peran (Role) | Username | Email Login | Password | Penempatan Cabang | Hak Akses Utama |
|---|---|---|---|---|---|---|---|
| 1 | **Aditia Muchlis** | `SUPER_ADMIN` | `superadmin` | `superadmin@dbesto.co.id` | `admin123` | Kantor Pusat (HQ) | Akses Penuh: Executive Dashboard, Master Cabang, Master Akun Staf, Seluruh Operasional Resto, Approval PO Gudang, Audit Opname, Audit Absensi GPS, CMS Menu/Promo/Berita/Kemitraan/Pengaturan. |
| 2 | **Bambang Pamungkas** | `RESTO_ADMIN` | `manager.margonda` | `admin.margonda@dbesto.co.id` | `manager123` | D'Besto Margonda Raya | Manajer Cabang: Dashboard Margonda, POS Kasir, Buka/Tutup Shift, Request PO Bahan Gudang, Stock Opname, Monitor Absensi Tim, Laporan Omzet Harian Cabang. |
| 3 | **Siti Rahmawati** | `CASHIER` | `kasir.margonda` | `kasir.margonda@dbesto.co.id` | `kasir123` | D'Besto Margonda Raya | Kasir Outlet: Dashboard Kas & Shift, Terminal POS Kasir (Dine-in, Takeaway, Delivery), Buka/Tutup Shift Kasir, Cetak Ulang Struk, Presensi GPS Masuk/Pulang. |
| 4 | **Ahmad Rizki** | `STAFF` | `staf.margonda` | `staf.margonda@dbesto.co.id` | `staf123` | D'Besto Margonda Raya | Staf Dapur & Kitchen: Dashboard Tugas Karyawan, Terminal Presensi Geofence GPS + Verifikasi Wajah Selfie, Formulir Hitung Stock Opname Bahan Dapur. |
| 5 | **Hendro Wijaya** | `RESTO_ADMIN` | `manager.fatmawati` | `admin.fatmawati@dbesto.co.id` | `manager123` | D'Besto Fatmawati | Manajer Cabang Fatmawati: Operasional Resto Cabang Fatmawati, Stock Opname, PO Bahan Baku, Laporan Penjualan Cabang. |
| 6 | **Dewi Sartika** | `CASHIER` | `kasir.fatmawati` | `kasir.fatmawati@dbesto.co.id` | `kasir123` | D'Besto Fatmawati | Kasir Outlet Fatmawati: Terminal POS Kasir Fatmawati, Buka/Tutup Shift Kasir, Presensi GPS Masuk/Pulang. |

---

## 🛡️ Mekanisme Autentikasi JWT (JSON Web Token)

1. **Format Login:**
   - Masukkan **Username** (contoh: `superadmin`, `kasir.margonda`) ATAU **Email** (contoh: `superadmin@dbesto.co.id`).
   - Masukkan **Password** yang sesuai pada tabel di atas.
2. **Generasi Token:**
   - Sistem menerbitkan JWT bertanda tangan digital algoritma **HS256** dengan masa aktif 7 hari.
   - Payload token berisi: `id`, `name`, `email`, `role`, `outletId`, `outletName`, `iat`, `exp`.
3. **Penyimpanan:**
   - Disimpan di `localStorage` (`dbesto_jwt_token`) dan HTTP cookie (`dbesto_jwt`).
4. **Validasi & Proteksi:**
   - Semua halaman `/admin/*` dan `/resto/*` membaca dan memverifikasi token JWT.
   - Menu sidebar dan metrik dashboard secara otomatis disesuaikan dengan `role` yang terkandung di dalam JWT token.
5. **Logout / Keluar:**
   - Menghapus token dari penyimpanan dan mengarahkan kembali ke `/auth/login`.
