"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import confetti from "canvas-confetti";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
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
  const [customerName, setCustomerName] = useState("Pelanggan D'Besto");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS" | "DEBIT_CARD">("QRIS");
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const orderItems = cart.map((item) => ({
      id: `item-${Date.now()}-${item.product.id}`,
      productId: item.product.id,
      productName: item.product.name,
      unitPrice: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      notes: item.notes,
    }));

    const newOrder = createOrder({
      outletId: currentOutlet.id,
      cashierId: currentUser.id,
      orderType,
      customerName: customerName || "Pelanggan D'Besto",
      customerPhone,
      subtotal,
      discountAmount: 0,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: total,
      changeAmount: 0,
      paymentMethod,
      paymentStatus: "PAID",
      notes: `Pemesanan Online Web (${orderType})`,
      items: orderItems,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    clearCart();
    setOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-100 text-[#D32323] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-zinc-900 text-lg leading-tight">Keranjang Pesanan</h3>
              <p className="text-xs text-zinc-500">
                {cart.length > 0 ? `${cart.length} menu dipilih` : "Keranjang masih kosong"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {orderSuccess ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h4 className="text-2xl font-black text-zinc-900">Pesanan Berhasil Masuk!</h4>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-left w-full space-y-1.5 text-xs">
              <p className="flex justify-between">
                <span className="text-zinc-500">No. Invoice:</span>
                <span className="font-mono font-bold text-zinc-900">{orderSuccess.invoiceNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Cabang Resto:</span>
                <span className="font-semibold text-zinc-900">{orderSuccess.outletName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Metode Bayar:</span>
                <span className="font-semibold text-zinc-900">{orderSuccess.paymentMethod}</span>
              </p>
              <p className="flex justify-between border-t border-zinc-200 pt-1 text-sm font-bold">
                <span>Total:</span>
                <span className="text-[#D32323]">{formatRupiah(orderSuccess.totalAmount)}</span>
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              Pesanan telah dikirim langsung ke POS kasir resto terkait. Silakan siapkan pembayaran / konfirmasi.
            </p>
            <button
              onClick={() => {
                setOrderSuccess(null);
                onClose();
              }}
              className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3 rounded-full transition shadow-md cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        ) : (
          <>
            {/* Body: Outlet Selector & Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Outlet Selector */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Pilih Cabang D&apos;Besto:</span>
                </div>
                <select
                  value={currentOutlet.id}
                  onChange={(e) => switchOutlet(e.target.value)}
                  className="w-full bg-white text-zinc-900 font-semibold text-xs rounded-lg p-2 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.city})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-700">
                  📍 {currentOutlet.address} • Jam: {currentOutlet.openingTime} - {currentOutlet.closingTime}
                </p>
              </div>

              {/* Order Type Toggle */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setOrderType("TAKEAWAY")}
                  className={`py-2 rounded-lg transition cursor-pointer ${
                    orderType === "TAKEAWAY" ? "bg-white text-[#D32323] shadow-xs" : "text-zinc-600"
                  }`}
                >
                  Bungkus
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("DINE_IN")}
                  className={`py-2 rounded-lg transition cursor-pointer ${
                    orderType === "DINE_IN" ? "bg-white text-[#D32323] shadow-xs" : "text-zinc-600"
                  }`}
                >
                  Makan Sini
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("DELIVERY_ONLINE")}
                  className={`py-2 rounded-lg transition cursor-pointer ${
                    orderType === "DELIVERY_ONLINE" ? "bg-white text-[#D32323] shadow-xs" : "text-zinc-600"
                  }`}
                >
                  Kirim
                </button>
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm font-medium">Belum ada menu di keranjang.</p>
                  <p className="text-xs">Klik tombol &quot;Pesan&quot; pada menu favoritmu!</p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-zinc-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image
                          src={item.product.image || "/images/menu/fried-chicken.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-zinc-900 truncate">{item.product.name}</h4>
                        <p className="text-xs text-[#D32323] font-black">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-100 px-2 py-1 rounded-full">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:text-red-600 cursor-pointer"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="text-xs font-bold text-zinc-900 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:text-emerald-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Customer Info Form */}
              {cart.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-800">Informasi Pemesan:</span>
                  <input
                    type="text"
                    placeholder="Nama Pemesan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                  />
                  <input
                    type="tel"
                    placeholder="Nomor WhatsApp (Contoh: 0812xxxx)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#D32323]"
                  />
                  <div className="pt-1">
                    <span className="text-xs font-bold text-zinc-800 block mb-1">Metode Pembayaran:</span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(["QRIS", "CASH", "DEBIT_CARD"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-2 rounded-lg border font-semibold text-center cursor-pointer transition ${
                            paymentMethod === method
                              ? "bg-red-50 border-[#D32323] text-[#D32323]"
                              : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          {method === "CASH" ? "Tunai" : method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Calculation & Submit */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-zinc-100 bg-zinc-50/80 space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PB1 Resto (10%)</span>
                    <span className="font-semibold text-zinc-900">{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-1 border-t border-zinc-200">
                    <span>Total Pembayaran</span>
                    <span className="text-[#D32323]">{formatRupiah(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold py-3.5 rounded-full shadow-lg shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Konfirmasi & Pesan Sekarang
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
