"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu as MenuIcon, X, MapPin, UserCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface NavbarProps {
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOrderNow?: () => void;
}

function NavbarContent({ onOpenCart, onOpenSearch, onOrderNow }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, currentOutlet, currentUser } = useAppStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Promo", href: "/promo" },
    { label: "Kemitraan", href: "/kemitraan" },
    { label: "Berita", href: "/berita" },
    { label: "Tentang Kami", href: "/tentang-kami" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-12 w-32 sm:h-14 sm:w-36 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/images/logo/dbesto-logo.png"
                  alt="D'Besto Chicken & Burger"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                    isActive
                      ? "text-[#D32323] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#D32323] after:rounded-full"
                      : "text-zinc-700 hover:text-[#D32323]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/outlet"
              className={`text-sm font-semibold transition-colors duration-150 relative py-1 flex items-center gap-1 ${
                pathname === "/outlet"
                  ? "text-[#D32323] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#D32323] after:rounded-full"
                  : "text-zinc-700 hover:text-[#D32323]"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Outlet</span>
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Cari Menu"
              className="p-2 text-zinc-700 hover:text-[#D32323] hover:bg-zinc-100 rounded-full transition cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Keranjang Belanja"
              className="p-2 text-zinc-700 hover:text-[#D32323] hover:bg-zinc-100 rounded-full transition relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D32323] text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Portal Staf Button */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-[#D32323] hover:border-red-300 hover:bg-red-50/50 transition-all cursor-pointer shadow-2xs"
              title="Portal Internal Staf & Dashboard Resto"
            >
              <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-bold">
                {currentUser ? currentUser.name.split(" ")[0] : "Portal Staf"}
              </span>
              {currentUser && (
                <span className="text-[9px] bg-red-100 text-[#D32323] font-black px-1.5 py-0.5 rounded-full tracking-wider">
                  {currentUser.role.replace("_", " ")}
                </span>
              )}
            </Link>

            {/* CTA Pesan Sekarang */}
            <button
              onClick={onOrderNow || onOpenCart}
              className="hidden sm:inline-flex items-center justify-center bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Pesan Sekarang
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-700 hover:text-[#D32323] hover:bg-zinc-100 rounded-lg transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-red-50 text-[#D32323] font-bold"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-[#D32323]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/outlet"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-base font-semibold flex items-center gap-2 ${
                pathname === "/outlet"
                  ? "bg-red-50 text-[#D32323] font-bold"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-[#D32323]"
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Lokasi Cabang ({currentOutlet.name})</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between text-zinc-800 bg-zinc-50 hover:bg-red-50 border border-zinc-200"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#D32323]" />
                <span>Portal Staf & Kasir ({currentUser ? currentUser.name.split(" ")[0] : "Login"})</span>
              </div>
              <span className="text-[10px] bg-red-100 text-[#D32323] px-2 py-0.5 rounded-full font-extrabold uppercase">
                {currentUser?.role || "PORTAL"}
              </span>
            </Link>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOrderNow) onOrderNow();
                }}
                className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-bold text-center py-3 rounded-full shadow-md transition"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar(props: NavbarProps) {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="relative h-12 w-32">
            <Image
              src="/images/logo/dbesto-logo.png"
              alt="D'Besto"
              fill
              className="object-contain"
            />
          </div>
        </header>
      }
    >
      <NavbarContent {...props} />
    </Suspense>
  );
}
