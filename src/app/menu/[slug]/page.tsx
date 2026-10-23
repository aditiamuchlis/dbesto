"use client";

import { use, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ArrowLeft,
  Sparkles,
  MapPin,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, addToCart, currentOutlet } = useAppStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCut, setSelectedCut] = useState("Dada / Paha Atas");
  const [selectedSpicy, setSelectedSpicy] = useState("Original Crispy");
  const [isAdded, setIsAdded] = useState(false);

  const product = products.find((p) => p.slug === resolvedParams.slug) || products[0];

  const handleAddToCart = () => {
    const customNotes = `${selectedCut} • ${selectedSpicy}`;
    addToCart(product, quantity, customNotes);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    const customNotes = `${selectedCut} • ${selectedSpicy}`;
    addToCart(product, quantity, customNotes);
    router.push("/checkout");
  };

  // Recommended related products
  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {}}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/menu" className="hover:text-zinc-900 transition">
            Menu
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[#D32323] font-bold truncate">{product.name}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-14">
        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 shadow-inner border border-zinc-100 group">
              <Image
                src={product.image || "/images/menu/fried-chicken.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#D32323] text-white text-xs font-black tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-lg flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{product.badge}</span>
                </span>
              )}
            </div>

            {/* Halal & Guarantee Strip */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FFFDF7] border border-amber-200/60 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-zinc-800">100% Halal MUI</p>
                  <p className="text-[10px] text-zinc-500">ID0041000012345</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FFFDF7] border border-amber-200/60 text-xs">
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-zinc-800">Digoreng Dadakan</p>
                  <p className="text-[10px] text-zinc-500">Selalu Renyah & Panas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Customization & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#D32323] bg-red-50 px-3 py-1 rounded-full">
                  Kategori Menu D&apos;Besto
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0</span>
                  <span className="text-zinc-400 font-normal">(500+ ulasan)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight">
                {product.name}
              </h1>

              <div className="text-3xl font-black text-[#D32323]">
                {formatRupiah(product.price)}
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed border-t border-b border-zinc-100 py-3">
                {product.description ||
                  "Olahan ayam goreng krispi dengan balutan tepung bumbu istimewa yang meresap sempurna hingga ke serat daging terdalam. Renyah di luar, empuk dan juicy di dalam."}
              </p>

              {/* Variant 1: Potongan */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-zinc-800 block">
                  Pilihan Potongan Ayam:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Dada / Paha Atas", "Paha Bawah", "Sayap Renyah"].map((cut) => (
                    <button
                      key={cut}
                      type="button"
                      onClick={() => setSelectedCut(cut)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                        selectedCut === cut
                          ? "bg-red-50 border-[#D32323] text-[#D32323] font-bold"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {cut}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant 2: Level Rasa */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-zinc-800 block">
                  Pilihan Varian Rasa:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Original Crispy", "Spicy Mercon", "Saus Keju Melt"].map((taste) => (
                    <button
                      key={taste}
                      type="button"
                      onClick={() => setSelectedSpicy(taste)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                        selectedSpicy === taste
                          ? "bg-red-50 border-[#D32323] text-[#D32323] font-bold"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {taste}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outlet Context */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D32323]" />
                  <span className="text-zinc-600">Disajikan dari outlet:</span>
                  <strong className="text-zinc-900">{currentOutlet.name}</strong>
                </div>
                <Link href="/outlet" className="text-[#D32323] font-bold hover:underline">
                  Ganti Outlet
                </Link>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-700">Jumlah:</span>
                <div className="inline-flex items-center border border-zinc-300 rounded-full bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black rounded-full transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black rounded-full transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right flex-1">
                  <span className="text-[11px] text-zinc-400 block">Subtotal</span>
                  <span className="text-lg font-black text-zinc-900">
                    {formatRupiah(product.price * quantity)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer shadow-md ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Berhasil Ditambahkan!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Tambah ke Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center py-3.5 px-6 rounded-full font-bold text-sm bg-[#D32323] hover:bg-[#B31818] text-white shadow-md shadow-red-500/25 transition cursor-pointer"
                >
                  Pesan & Checkout Langsung
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional & Highlights Table */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-black text-zinc-900">Komposisi & Nilai Gizi Acuan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-100">
              <span className="text-xs text-zinc-500 font-semibold block mb-1">Energi Total</span>
              <p className="text-2xl font-black text-zinc-900">350 <span className="text-xs font-normal">kcal</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-100">
              <span className="text-xs text-zinc-500 font-semibold block mb-1">Protein Segar</span>
              <p className="text-2xl font-black text-emerald-600">28 <span className="text-xs font-normal">gram</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-100">
              <span className="text-xs text-zinc-500 font-semibold block mb-1">Lemak Alami</span>
              <p className="text-2xl font-black text-amber-600">17 <span className="text-xs font-normal">gram</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-100">
              <span className="text-xs text-zinc-500 font-semibold block mb-1">Karbohidrat</span>
              <p className="text-2xl font-black text-zinc-900">14 <span className="text-xs font-normal">gram</span></p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D32323] block">
                REKOMENDASI PENDAMPING
              </span>
              <h2 className="text-2xl font-black text-zinc-900">Menu Paling Pas Dinikmati Bersama</h2>
            </div>
            <Link
              href="/menu"
              className="text-xs font-bold text-[#D32323] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Menu</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-lg transition p-3 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/menu/${p.slug}`} className="block relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                    <Image
                      src={p.image || "/images/menu/fried-chicken.jpg"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <Link href={`/menu/${p.slug}`}>
                    <h4 className="font-extrabold text-sm text-zinc-900 hover:text-[#D32323] line-clamp-1">
                      {p.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#D32323] font-black mt-1">
                    {formatRupiah(p.price)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    addToCart(p, 1);
                    setIsCartOpen(true);
                  }}
                  className="mt-3 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-2 rounded-xl transition"
                >
                  + Tambah
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function ProductDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-[#D32323] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductDetailContent {...props} />
    </Suspense>
  );
}
