import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Senior Dev: Use next/font
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Global Green Exporter - Premium Rare Plants from Borneo",
  description: "Verified exporter of rare Scindapsus and Aroids from Indonesia to the world. Phytosanitary certified.",
};

import { CartProvider } from "@/components/cart-provider";
import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable)}>
      <body className="antialiased min-h-screen flex flex-col bg-cream-50 font-sans">
        <AuthProvider>
          <CartProvider>
            <SiteHeader />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <SiteFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
