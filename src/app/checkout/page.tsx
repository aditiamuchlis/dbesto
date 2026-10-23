"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggalIndo } from "@/lib/formatters";
import {
  ShoppingBag,
  MapPin,
  QrCode,
  Banknote,
  CreditCard,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Printer,
  Share2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Store,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PosOrder } from "@/lib/types";

export default function CheckoutPage() {
  const {
    cart,
    updateCartQty,
    clearCart,
    outlets,
    currentOutlet,
    switchOutlet,
    createOrder,
    currentUser,
  } = useAppStore();

  const [orderType, setOrderType] = useState<"TAKEAWAY" | "DINE_IN" | "DELIVERY_ONLINE">("TAKEAWAY");
  const [customerName, setCustomerName] = useState("Pelanggan Setia");
  const [customerPhone, setCustomerPhone] = useState("0812-8877-9900");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "CASH" | "DEBIT_CARD" | "TRANSFER">("QRIS");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<PosOrder | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.1);
  const packagingFee = orderType === "TAKEAWAY" ? 2000 : 0;
  const total = taxableAmount + tax + packagingFee;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "CLUCKSERU" || code === "WEEKENDSERU") {
      setDiscountPercent(20);
      alert(`Kupon ${code} berhasil dipasang! Diskon 20% diterapkan.`);
    } else if (code === "HEMATJUMAT") {
      setDiscountPercent(15);
      alert(`Kupon ${code} berhasil dipasang! Diskon 15% diterapkan.`);
    } else {
      alert("Kode kupon tidak valid atau sudah kedaluwarsa.");
    }
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) return;

    const orderNotes = [
      notes,
      orderType === "DELIVERY_ONLINE" && customerAddress ? `Alamat Antar: ${customerAddress}` : "",
      promoCode ? `Promo: ${promoCode}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const created = createOrder({
      outletId: currentOutlet.id,
      cashierId: currentUser.id,
      orderType,
      customerName: customerName || "Pelanggan Online",
      customerPhone,
      subtotal,
      discountAmount,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: total,
      changeAmount: 0,
      paymentMethod,
      paymentStatus: "PAID",
      notes: orderNotes,
      items: cart.map((item, idx) => ({
        id: `poi-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        notes: item.notes,
      })),
    });

    setCompletedOrder(created);
    clearCart();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleShareWhatsApp = () => {
    if (!completedOrder) return;
    const msg = `Halo D'Besto! Saya sudah order di website resmi.%0ANo Struk: *${completedOrder.invoiceNumber}*%0AOutlet: *${currentOutlet.name}*%0ATotal Bayar: *${formatRupiah(completedOrder.totalAmount)}*%0AMetode: *${completedOrder.paymentMethod}*%0AMohon segera diproses ya!`;
    window.open(`https://wa.me/628119988771?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/menu" className="hover:text-zinc-900 transition">
            Menu
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[#D32323] font-bold">Checkout Pemesanan</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {completedOrder ? (
          /* Order Completed Invoice View */
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-500 text-white p-6 rounded-3xl text-center space-y-2 shadow-lg">
              <CheckCircle2 className="w-12 h-12 mx-auto stroke-[2.2]" />
              <h2 className="text-2xl font-black">Pesanan Berhasil Diterbitkan!</h2>
              <p className="text-xs text-emerald-100 max-w-md mx-auto">
                Dapur cabang <strong>{currentOutlet.name}</strong> telah menerima tiket order Anda
                dan sedang menyiapkan hidangan ayam krispi hangat.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-md space-y-6 font-mono text-xs">
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-zinc-300">
                <div className="relative h-10 w-28 mx-auto mb-2">
                  <Image
                    src="/images/logo/dbesto-logo.png"
                    alt="D'Besto"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-sans font-black text-base text-zinc-900 tracking-tight">
                  {currentOutlet.name}
                </h3>
                <p className="text-zinc-500 font-sans text-[11px]">{currentOutlet.address}</p>
                <p className="text-zinc-400 font-sans text-[11px]">Telp: {currentOutlet.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600">
                <div>
                  <span className="text-zinc-400 block">No. Invoice:</span>
                  <strong className="text-zinc-900">{completedOrder.invoiceNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block">Waktu:</span>
                  <strong className="text-zinc-900">
                    {formatTanggalIndo(completedOrder.createdAt, true)}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-400 block">Nama Pemesan:</span>
                  <strong className="text-zinc-900">{completedOrder.customerName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block">Tipe Layanan:</span>
                  <span className="inline-block bg-zinc-900 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded">
                    {completedOrder.orderType}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-b border-dashed border-zinc-300 py-4 space-y-2.5">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-zinc-900">
                        {item.quantity}x {item.productName}
                      </p>
                      {item.notes && <p className="text-[10px] text-zinc-400 font-sans">{item.notes}</p>}
                    </div>
                    <span className="font-semibold text-zinc-900">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(completedOrder.subtotal)}</span>
                </div>
                {completedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon Promo</span>
                    <span>-{formatRupiah(completedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>PB1 Resto (10%)</span>
                  <span>{formatRupiah(completedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>TOTAL AKHIR</span>
                  <span className="text-[#D32323]">{formatRupiah(completedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between pt-1 text-zinc-500">
                  <span>Metode Bayar:</span>
                  <span className="font-bold text-zinc-900">{completedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center font-sans text-[11px] text-zinc-400 pt-4 border-t border-dashed border-zinc-300">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Kualitas Halal, Rasa Spesial, Harga Sahabat.</p>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 font-sans">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-6 py-3 rounded-full transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota Struk</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-full transition cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Kirim Bukti ke WhatsApp</span>
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-6 py-3 rounded-full transition cursor-pointer"
              >
                <span>Pesan Menu Baru</span>
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-4 my-10">
            <div className="w-16 h-16 bg-red-50 text-[#D32323] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Keranjang Belanja Masih Kosong</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Anda belum memilih menu lezat D&apos;Besto. Silakan jelajahi katalog menu kami untuk
              menikmati ayam krispi favorit.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold px-6 py-3 rounded-full transition shadow-md"
            >
              <span>Buka Katalog Menu</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Full Checkout Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Delivery, Details & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Order Type Selector */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
                  LANGKAH 1
                </span>
                <h3 className="text-lg font-black text-zinc-900">Pilih Jenis Pemesanan</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "TAKEAWAY", label: "Takeaway", sub: "Bungkus Bawa Pulang" },
                    { id: "DINE_IN", label: "Dine-in", sub: "Makan di Resto" },
                    { id: "DELIVERY_ONLINE", label: "Delivery", sub: "Pesan Antar Alamat" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setOrderType(type.id as any)}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                        orderType === type.id
                          ? "bg-red-50 border-[#D32323] text-[#D32323] shadow-xs"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <strong className="block text-xs font-bold">{type.label}</strong>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">{type.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outlet Context */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
                    LANGKAH 2
                  </span>
                  <Link href="/outlet" className="text-xs font-bold text-[#D32323] hover:underline">
                    Ganti Outlet Lain
                  </Link>
                </div>
                <h3 className="text-lg font-black text-zinc-900">Cabang Resto Penyaji</h3>

                <div className="bg-[#FFFDF7] border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="text-xs space-y-1">
                    <strong className="text-sm font-black text-zinc-900 block">
                      {currentOutlet.name} ({currentOutlet.code})
                    </strong>
                    <p className="text-zinc-600">{currentOutlet.address}</p>
                    <p className="text-zinc-500">
                      Buka: {currentOutlet.openingTime} - {currentOutlet.closingTime} WIB • Telp:{" "}
                      {currentOutlet.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
                  LANGKAH 3
                </span>
                <h3 className="text-lg font-black text-zinc-900">Data Pemesan</h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700">Nama Penerima / Pemesan *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama lengkap"
                        className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700">No. WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812xxxx"
                        className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                      />
                    </div>
                  </div>

                  {orderType === "DELIVERY_ONLINE" && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700">Alamat Lengkap Pengiriman *</label>
                      <textarea
                        rows={2}
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, patokan lokasi..."
                        className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Catatan Khusus untuk Dapur</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Sambal dipisah, saus ekstra, jangan terlalu pedas"
                      className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#D32323]">
                  LANGKAH 4
                </span>
                <h3 className="text-lg font-black text-zinc-900">Pilih Metode Pembayaran</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "QRIS", label: "QRIS Dinamis", sub: "Scan Semua Bank & E-Wallet", icon: QrCode },
                    { id: "CASH", label: "Tunai di Kasir", sub: "Bayar saat Ambil Pesanan", icon: Banknote },
                    { id: "TRANSFER", label: "Transfer Bank", sub: "Virtual Account BCA / Mandiri", icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                          paymentMethod === m.id
                            ? "bg-red-50 border-[#D32323] text-[#D32323] shadow-xs"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <strong className="block text-xs font-bold">{m.label}</strong>
                        <span className="text-[10px] text-zinc-500 block">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Voucher */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
                <h3 className="text-lg font-black text-zinc-900 border-b border-zinc-100 pb-3">
                  Ringkasan Keranjang ({cart.reduce((a, b) => a + b.quantity, 0)} Item)
                </h3>

                {/* Items */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image
                          src={item.product.image || "/images/menu/fried-chicken.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-extrabold text-zinc-900 truncate">{item.product.name}</h4>
                        {item.notes && <p className="text-[10px] text-zinc-400 truncate">{item.notes}</p>}
                        <span className="font-bold text-[#D32323] mt-0.5 block">
                          {formatRupiah(item.product.price)}
                        </span>
                      </div>

                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-zinc-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-zinc-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher Box */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-700">Punya Kupon Promo?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kode kupon (CLUCKSERU)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-zinc-200 uppercase font-mono font-bold focus:outline-none focus:border-[#D32323]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-4 rounded-xl transition cursor-pointer"
                    >
                      Pakai
                    </button>
                  </div>
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal Menu</span>
                    <span className="font-semibold text-zinc-900">{formatRupiah(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Diskon ({discountPercent}%)</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>PB1 Resto (10%)</span>
                    <span className="font-semibold text-zinc-900">{formatRupiah(tax)}</span>
                  </div>
                  {packagingFee > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya Dus Takeaway Higienis</span>
                      <span className="font-semibold text-zinc-900">{formatRupiah(packagingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                    <span>Total Pembayaran</span>
                    <span className="text-[#D32323]">{formatRupiah(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProcessOrder}
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-black py-4 rounded-full shadow-lg shadow-red-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
                >
                  Konfirmasi & Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
