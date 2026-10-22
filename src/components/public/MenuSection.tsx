"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Check, Star, Flame, Eye } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/formatters";

interface MenuSectionProps {
  onOpenCart?: () => void;
}

export function MenuSection({ onOpenCart }: MenuSectionProps) {
  const { products, categories, addToCart } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header exactly as sample */}
        <div className="text-left mb-10">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#D32323] block mb-1">
            MENU PILIHAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Favorit Pelanggan
          </h2>
          <p className="mt-2 text-base text-zinc-600 max-w-2xl">
            Beragam menu lezat yang selalu jadi pilihan, dari ayam crispy berbalut rempah meresap
            hingga burger renyah dan minuman segar.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            Semua Menu
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#D32323] text-white shadow-md shadow-red-500/20"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <Image
                      src={product.image || "/images/menu/fried-chicken.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#D32323] text-white text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md">
                        {product.badge}
                      </span>
                    )}

                    {product.calories && (
                      <span className="absolute bottom-3 left-3 bg-zinc-950/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {product.calories}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-zinc-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                      {product.categoryName || "D'Besto Special"}
                    </p>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#D32323] transition-colors leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Price & Add Button */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-3 border-t border-zinc-100 mt-2">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-medium">Harga</span>
                    <span className="text-lg font-black text-[#D32323]">
                      {formatRupiah(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all duration-200 cursor-pointer shadow-sm ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#D32323] hover:bg-[#B31818] text-white hover:shadow-red-500/25 transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Pesan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative aspect-[16/10] bg-zinc-100">
              <Image
                src={selectedProduct.image || "/images/menu/fried-chicken.jpg"}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-zinc-900 rounded-full p-2 shadow-md cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#D32323] uppercase">
                  {selectedProduct.categoryName}
                </span>
                {selectedProduct.badge && (
                  <span className="bg-red-100 text-[#D32323] text-xs font-bold px-2 py-0.5 rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-zinc-900">{selectedProduct.name}</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              <div className="mt-4 py-3 border-y border-zinc-100 flex items-center justify-around text-xs text-zinc-500">
                <span>⚡ {selectedProduct.calories || "250 kkal"}</span>
                <span>🍗 {selectedProduct.pieces || "1 Porsi"}</span>
                <span>✔️ 100% Halal MUI</span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Harga</span>
                  <span className="text-2xl font-black text-[#D32323]">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleAdd(selectedProduct);
                    setSelectedProduct(null);
                    if (onOpenCart) onOpenCart();
                  }}
                  className="bg-[#D32323] hover:bg-[#B31818] text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-red-500/25 transition cursor-pointer"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
