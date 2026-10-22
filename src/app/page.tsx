"use client";

import { useState } from "react";
import { QuickPortalBanner } from "@/components/public/QuickPortalBanner";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { FeatureBadges } from "@/components/public/FeatureBadges";
import { MenuSection } from "@/components/public/MenuSection";
import { PromoSection } from "@/components/public/PromoSection";
import { OutletLocatorSection } from "@/components/public/OutletLocatorSection";
import { StorySection } from "@/components/public/StorySection";
import { Footer } from "@/components/public/Footer";
import { CartDrawer } from "@/components/public/CartDrawer";
import { SearchModal } from "@/components/public/SearchModal";

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Ecosystem Switcher Banner */}
      <QuickPortalBanner />

      {/* Main Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Hero Section matching landing_page_sample.png */}
      <main className="flex-1">
        <HeroSection onOrderNow={() => setIsCartOpen(true)} />

        {/* 4 Feature Badges strip matching landing_page_sample.png */}
        <FeatureBadges />

        {/* Menu Pilihan - Favorit Pelanggan matching landing_page_sample.png */}
        <MenuSection onOpenCart={() => setIsCartOpen(true)} />

        {/* Promos */}
        <PromoSection />

        {/* Outlet Locator */}
        <OutletLocatorSection onSelectOutlet={() => setIsCartOpen(true)} />

        {/* Brand Story & Franchise */}
        <StorySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={() => setIsCartOpen(true)}
      />
    </div>
  );
}
