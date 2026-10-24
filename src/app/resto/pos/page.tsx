"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  Share2,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatJam } from "@/lib/formatters";
import { Product, OrderType, PaymentMethod, PosOrder } from "@/lib/types";
import confetti from "canvas-confetti";

interface CartLine {
  product: Product;
  quantity: number;
  notes?: string;
}

export default function PosPage() {
  const {
    products,
    categories,
    currentOutlet,
    currentUser,
    shifts,
    createOrder,
  } = useAppStore();

  const activeShift = shifts.find(
    (s) => s.outletId === currentOutlet.id && s.status === "OPEN"
  );

  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [customerName, setCustomerName] = useState("Pelanggan D'Besto");

  // Payment Modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<PosOrder | null>(null);

  // Filtered menu
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === "all" || p.categoryId === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearPosCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1); // 10% PB1
  const discount = 0;
  const total = subtotal + tax - discount;

  const change = paymentMethod === "CASH" ? Math.max(0, cashTendered - total) : 0;
  const canPay =
    paymentMethod === "CASH" ? cashTendered >= total : total > 0;

  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    setCashTendered(total); // default exact amount
    setIsPayModalOpen(true);
  };

  const handleFinishPayment = () => {
    if (!canPay) return;

    const items = cart.map((c) => ({
      id: `pos-item-${Date.now()}-${c.product.id}`,
      productId: c.product.id,
      productName: c.product.name,
      unitPrice: c.product.price,
      quantity: c.quantity,
      subtotal: c.product.price * c.quantity,
      notes: c.notes,
    }));

    const order = createOrder({
      outletId: currentOutlet.id,
      shiftId: activeShift?.id,
      cashierId: currentUser.id,
      orderType,
      customerName: customerName || "Pelanggan D'Besto",
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: paymentMethod === "CASH" ? cashTendered : total,
      changeAmount: change,
      paymentMethod,
      paymentStatus: "PAID",
      notes: `POS Kasir (${orderType})`,
      items,
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsPayModalOpen(false);
    setCompletedOrder(order);
    setCart([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* If Shift is not open */}
      {!activeShift && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">Shift Kasir Belum Dibuka</h3>
            <p className="text-sm text-zinc-600">
              Sebelum memproses transaksi POS di cabang <strong>{currentOutlet.name}</strong>, kasir wajib membuka shift dan menginput modal kas awal.
            </p>
            <Link
              href="/resto/pos/shift"
              className="block w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-full transition shadow-lg shadow-red-500/25"
            >
              Buka Shift Kasir Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* LEFT: Product Catalog (Touch Friendly) */}
      <div className="lg:w-7/12 xl:w-8/12 flex flex-col bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
        {/* Top Filter Bar */}
        <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/50">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari menu POS cepat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 focus:outline-none focus:border-[#D32323] bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCat === "all" ? "bg-[#D32323] text-white shadow-xs" : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCat === cat.id
                    ? "bg-[#D32323] text-white shadow-xs"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-zinc-400">
              <AlertCircle className="w-8 h-8 mb-2 text-zinc-300" />
              <p className="text-xs font-bold text-zinc-600">Belum Ada Menu di Katalog POS</p>
              <p className="text-[11px] text-zinc-400 max-w-xs mt-1">
                Produk menu belum ditambahkan. Admin dapat menambahkan produk melalui menu Manajemen Menu di Admin Portal.
              </p>
              <Link
                href="/admin/menu"
                className="mt-3 text-xs font-bold text-[#D32323] hover:underline"
              >
                Ke Master Menu →
              </Link>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="group bg-white rounded-2xl border border-zinc-200/80 p-2.5 flex flex-col justify-between hover:border-[#D32323] hover:shadow-md transition-all cursor-pointer select-none active:scale-95"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 mb-2">
                  <Image
                    src={product.image || "/images/menu/fried-chicken.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-[#D32323] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#D32323] transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#D32323]">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-red-50 text-[#D32323] flex items-center justify-center font-bold text-xs group-hover:bg-[#D32323] group-hover:text-white transition">
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Order Cart & Checkout Summary */}
      <div className="lg:w-5/12 xl:w-4/12 flex flex-col bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
        {/* Cart Top Options */}
        <div className="p-4 border-b border-zinc-100 space-y-3 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-zinc-900">Ringkasan Order Kasir</h3>
            {cart.length > 0 && (
              <button
                onClick={clearPosCart}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Dine-In / Takeaway / Online Partner selector */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-200/60 rounded-xl text-xs font-bold">
            {(["DINE_IN", "TAKEAWAY", "DELIVERY_ONLINE"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  orderType === type
                    ? "bg-white text-[#D32323] shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {type === "DINE_IN" ? "Dine In" : type === "TAKEAWAY" ? "Takeaway" : "Ojol / Deliv"}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Nama Pelanggan (opsional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-zinc-200 bg-white focus:outline-none focus:border-[#D32323]"
          />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-zinc-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 space-y-2">
              <span className="text-4xl block">🍗</span>
              <p className="text-xs font-semibold">Belum ada item pesanan.</p>
              <p className="text-[11px]">Ketuk menu di sebelah kiri untuk menambah.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h5>
                  <p className="text-[11px] text-[#D32323] font-semibold">
                    {formatRupiah(item.product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded-full">
                  <button
                    onClick={() => updateQty(item.product.id, -1)}
                    className="p-0.5 text-zinc-600 hover:text-red-600 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-extrabold px-1 text-zinc-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, 1)}
                    className="p-0.5 text-zinc-600 hover:text-emerald-600 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-xs font-black text-zinc-900 w-16 text-right">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Subtotal & Action Bar */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-3">
          <div className="space-y-1 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-zinc-900">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>PB1 Resto (10%):</span>
              <span className="font-semibold text-zinc-900">{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 pt-1 border-t border-zinc-200">
              <span>Total Tagihan:</span>
              <span className="text-[#D32323]">{formatRupiah(total)}</span>
            </div>
          </div>

          <button
            onClick={handleOpenPayment}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md cursor-pointer ${
              cart.length === 0
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-[#D32323] hover:bg-[#B31818] text-white shadow-red-500/25 active:scale-98"
            }`}
          >
            Bayar Pesanan ({formatRupiah(total)})
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-zinc-900">Pembayaran Kasir</h3>
                <p className="text-xs text-zinc-500">Total Tagihan: <span className="font-black text-[#D32323] text-sm">{formatRupiah(total)}</span></p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === "CASH"
                    ? "bg-red-50 border-[#D32323] text-[#D32323] font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Banknote className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Uang Tunai</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("QRIS")}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === "QRIS"
                    ? "bg-red-50 border-[#D32323] text-[#D32323] font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <QrCode className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">QRIS Dinamis</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("DEBIT_CARD")}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === "DEBIT_CARD"
                    ? "bg-red-50 border-[#D32323] text-[#D32323] font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Kartu Debit</span>
              </button>
            </div>

            {/* Cash Input Details */}
            {paymentMethod === "CASH" && (
              <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <label className="text-xs font-bold text-zinc-700 block">
                  Uang Diserahkan Pelanggan:
                </label>
                <input
                  type="number"
                  value={cashTendered || ""}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-2xl font-black text-zinc-900 p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] bg-white"
                />

                {/* Quick Cash Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setCashTendered(total)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-[#D32323] text-xs font-bold text-zinc-800 transition cursor-pointer"
                  >
                    Uang Pas ({formatRupiah(total)})
                  </button>
                  <button
                    onClick={() => setCashTendered(50000)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-[#D32323] text-xs font-bold text-zinc-800 transition cursor-pointer"
                  >
                    50.000
                  </button>
                  <button
                    onClick={() => setCashTendered(100000)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-[#D32323] text-xs font-bold text-zinc-800 transition cursor-pointer"
                  >
                    100.000
                  </button>
                  <button
                    onClick={() => setCashTendered(200000)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-[#D32323] text-xs font-bold text-zinc-800 transition cursor-pointer"
                  >
                    200.000
                  </button>
                </div>

                {/* Change calculation */}
                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-zinc-700">Kembalian:</span>
                  <span
                    className={`font-black text-lg ${
                      cashTendered < total ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {cashTendered < total
                      ? `Kurang ${formatRupiah(total - cashTendered)}`
                      : formatRupiah(change)}
                  </span>
                </div>
              </div>
            )}

            {/* QRIS View */}
            {paymentMethod === "QRIS" && (
              <div className="text-center p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
                  <QrCode className="w-36 h-36 mx-auto text-zinc-900" />
                </div>
                <p className="text-xs font-bold text-zinc-700">QRIS D&apos;BESTO MERCHANT ID: MRG01-DBESTO</p>
                <p className="text-[11px] text-zinc-500">Mendukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri</p>
              </div>
            )}

            {/* Debit Card View */}
            {paymentMethod === "DEBIT_CARD" && (
              <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <label className="text-xs font-bold text-zinc-700 block">Nomor Referensi EDC / Approval Code:</label>
                <input
                  type="text"
                  placeholder="Contoh: EDC-BCA-987123"
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#D32323] bg-white"
                />
              </div>
            )}

            {/* Submit Payment */}
            <button
              onClick={handleFinishPayment}
              disabled={!canPay}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition shadow-lg cursor-pointer ${
                canPay
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 active:scale-98"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              }`}
            >
              Konfirmasi & Selesaikan Transaksi
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED RECEIPT MODAL (Thermal 58mm / 80mm preview) */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transaksi Selesai</span>
              </span>
              <button
                onClick={() => setCompletedOrder(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Thermal Receipt Paper View */}
            <div
              id="thermal-receipt"
              className="bg-white p-4 border border-zinc-300 rounded-xl font-mono text-[11px] text-zinc-900 space-y-2 shadow-inner"
            >
              <div className="text-center space-y-0.5 border-b border-dashed border-zinc-400 pb-2">
                <h4 className="font-extrabold text-sm uppercase">D&apos;BESTO CHICKEN & BURGER</h4>
                <p className="text-[10px]">{completedOrder.outletName}</p>
                <p className="text-[9px]">{currentOutlet.address}</p>
              </div>

              <div className="space-y-0.5 text-[10px] border-b border-dashed border-zinc-400 pb-2">
                <div className="flex justify-between">
                  <span>No:</span>
                  <span className="font-bold">{completedOrder.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{formatJam(completedOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>{completedOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe:</span>
                  <span className="font-bold">{completedOrder.orderType}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 border-b border-dashed border-zinc-400 pb-2">
                {completedOrder.items.map((it) => (
                  <div key={it.id} className="space-y-0.5">
                    <p className="font-bold text-[10px] leading-tight">{it.productName}</p>
                    <div className="flex justify-between text-[10px] text-zinc-700">
                      <span>{it.quantity} x {formatRupiah(it.unitPrice)}</span>
                      <span>{formatRupiah(it.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-0.5 text-[10px] border-b border-dashed border-zinc-400 pb-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(completedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 (10%)</span>
                  <span>{formatRupiah(completedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xs pt-1">
                  <span>TOTAL</span>
                  <span>{formatRupiah(completedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bayar ({completedOrder.paymentMethod})</span>
                  <span>{formatRupiah(completedOrder.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Kembalian</span>
                  <span>{formatRupiah(completedOrder.changeAmount)}</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-zinc-500 pt-1">
                <p>Terima Kasih Atas Kunjungan Anda!</p>
                <p>100% Halal MUI & Nikmat Juara</p>
                <p>Kritik/Saran: 0812-XXXX-XXXX</p>
              </div>
            </div>

            {/* Print & Share Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk Thermal</span>
              </button>
              <button
                onClick={() => {
                  const msg = `Struk D'Besto: ${completedOrder.invoiceNumber} Total: ${formatRupiah(completedOrder.totalAmount)}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="inline-flex items-center justify-center p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer"
                title="Kirim Nota WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setCompletedOrder(null)}
              className="w-full bg-[#D32323] hover:bg-[#B31818] text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Transaksi Baru (+ Order)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
