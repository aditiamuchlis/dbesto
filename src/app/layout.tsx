import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dbesto.co.id"),
  title: "D'Besto Chicken & Burger - Nikmati Menu Favorit di Setiap Momen",
  description:
    "Etalase resmi brand D'Besto Fried Chicken & Burger. Sajian ayam krispi lezat, renyah bumbu meresap, 100% Halal MUI, dan ratusan resto di seluruh Indonesia.",
  keywords: "D'Besto, Fried Chicken, Burger, Ayam Geprek, Resto Cepat Saji, Halal, Promo D'Besto",
  openGraph: {
    title: "D'Besto Chicken & Burger",
    description: "Nikmati Menu Favorit D'Besto di Setiap Momen",
    images: ["/images/hero/hero-plate.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
