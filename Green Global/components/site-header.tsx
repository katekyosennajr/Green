'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, Phone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart-provider';

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-cream-50/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-serif text-2xl font-bold text-green-800 tracking-tight">
                        Global<span className="text-gold-600">Green</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-green-900">
                    <Link href="/catalog" className="hover:text-gold-600 transition-colors">
                        Catalog
                    </Link>
                    <Link href="/about" className="hover:text-gold-600 transition-colors">
                        About Us
                    </Link>
                    <Link href="/export-info" className="hover:text-gold-600 transition-colors">
                        Export Process
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">

                    {/* Currency / Lang (Mock) */}
                    <div className="hidden md:flex text-xs font-semibold border-r border-green-200 pr-4 space-x-2">
                        <button className="text-green-800">USD</button>
                        <span className="text-green-300">|</span>
                        <button className="text-green-400">IDR</button>
                    </div>

                    <Link
                        href="/contact"
                        className="hidden md:inline-flex items-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        <Phone className="w-3 h-3 mr-2" />
                        B2B Quote
                    </Link>

                    <Link href="/cart" className="relative p-2 hover:bg-green-100 rounded-full transition-colors">
                        <ShoppingCart className="w-5 h-5 text-green-900" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-gold-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        className="md:hidden p-2 text-green-900"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-green-100 bg-white p-4 space-y-4">
                    <Link href="/catalog" className="block text-green-900 font-medium">Catalog</Link>
                    <Link href="/about" className="block text-green-900 font-medium">About</Link>
                    <Link href="/contact" className="block text-gold-600 font-bold">Request Quote</Link>
                </div>
            )}
        </header>
    );
}
