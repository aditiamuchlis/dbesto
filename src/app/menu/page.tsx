"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { SearchModal } from "@/components/public/SearchModal";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import { Search, Plus, Check, Star, Filter, ArrowUpDown, ChevronRight, Flame } from "lucide-react";
import { Product } from "@/lib/types";

export default function MenuCatalogPage() {
  const { products, categories, addToCart } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = products
    .filter((p) => {
      const matchCat = selectedCategory === "all" || p.categoryId === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <QuickPortalBanner />
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
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
            <span className="text-amber-400 font-semibold">Katalog Menu</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase block mb-1">
                SELALU KRISPI & LEZAT
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Katalog Menu D&apos;Besto
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-xl">
                Nikmati olahan ayam marinasi rempah pilihan, burger juicy, paket komplit nasi pulen,
                dan minuman segar dengan standar 100% Halal MUI.
              </p>
            </div>

            {/* Quick search bar inside hero */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Cari menu favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:bg-zinc-900 focus:border-[#FFC107] transition"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sorting Bar */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#D32323] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Semua ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#D32323] text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 flex-shrink-0 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500 font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-100 border border-zinc-200 text-zinc-800 font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D32323] cursor-pointer"
            >
              <option value="featured">Paling Populer</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-zinc-500">
              Tidak ada menu yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Coba cari dengan kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const isJustAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <Link href={`/menu/${product.slug}`} className="block relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                      <Image
                        src={product.image || "/images/menu/fried-chicken.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-[#D32323] text-white text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>{product.badge}</span>
                        </span>
                      )}
                    </Link>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-zinc-400 font-normal">• 100% Halal</span>
                      </div>

                      <Link href={`/menu/${product.slug}`}>
                        <h3 className="font-extrabold text-zinc-900 text-base leading-snug group-hover:text-[#D32323] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 mt-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Harga Resmi</span>
                      <span className="text-base font-black text-[#D32323]">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/menu/${product.slug}`}
                        className="text-xs font-bold text-zinc-600 hover:text-[#D32323] px-2.5 py-2 transition"
                      >
                        Detail
                      </Link>
                      <button
                        onClick={(e) => handleAdd(product, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#D32323] hover:bg-[#B31818] text-white shadow-xs"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Ditambah!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Pesan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={() => setIsCartOpen(true)}
      />
    </div>
  );
}
