"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: () => void;
}

export function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const { products, addToCart } = useAppStore();
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase())) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            autoFocus
            placeholder="Cari ayam, burger, paket, minuman D'Besto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-sm text-zinc-400">
              Tidak ada menu yang sesuai dengan &quot;{query}&quot;
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition border border-transparent hover:border-zinc-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                    <Image
                      src={item.image || "/images/menu/fried-chicken.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#D32323] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-black text-[#D32323]">{formatRupiah(item.price)}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(item, 1);
                    if (onSelectProduct) onSelectProduct();
                    onClose();
                  }}
                  className="bg-[#D32323] hover:bg-[#B31818] text-white p-2 rounded-full transition shadow-xs cursor-pointer"
                  title="Tambah ke Pesanan"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
