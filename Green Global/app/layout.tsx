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
  metadataBase: new URL('https://globalgreenexporter.com'), // Placeholder domain
  title: {
    default: "Global Green Exporter - Premium Rare Plants from Borneo",
    template: "%s | Global Green Exporter"
  },
  description: "Verified exporter of rare Scindapsus and Aroids from Indonesia to the world. 100% Phytosanitary certified, genetic guarantee, and premium shipping.",
  keywords: ["Rare Plants", "Scindapsus Borneo", "Aroid Exporter", "Indonesian Plants", "Wholesale Plants", "Phytosanitary Certified"],
  authors: [{ name: "Global Green Team" }],
  creator: "Global Green Exporter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://globalgreenexporter.com",
    title: "Global Green Exporter - Premium Rare Plants",
    description: "Discover ethically sourced, rare botanical treasures from the heart of Borneo.",
    siteName: "Global Green Exporter",
    images: [
      {
        url: "/og-image.jpg", // Needs to be added or handled
        width: 1200,
        height: 630,
        alt: "Global Green Exporter Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Green Exporter",
    description: "Premium rare plants from Borneo to your doorstep.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { CartProvider } from "@/components/cart-provider";
import { AuthProvider } from "@/components/auth-provider";

import { CurrencyProvider } from "@/components/currency-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable)}>
      <body className="antialiased min-h-screen flex flex-col bg-cream-50 font-sans">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <SiteHeader />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <SiteFooter />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
