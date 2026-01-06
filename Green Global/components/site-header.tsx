'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Phone, User as UserIcon, LogOut, Package, Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart-provider';
import { useCurrency } from '@/components/currency-provider';
import { useSession, signOut } from 'next-auth/react';

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { currency, setCurrency } = useCurrency();
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-cream-50/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                    <span className="font-serif text-2xl font-bold text-green-800 tracking-tight">
                        Global<span className="text-gold-600">Green</span>
                    </span>
                </Link>

                {/* Navigasi Desktop - Perfectly Centered */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-green-900 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <Link href="/catalog" className="hover:text-gold-600 transition-colors">
                        Catalog
                    </Link>
                    <Link href="/about" className="hover:text-gold-600 transition-colors">
                        About Us
                    </Link>
                    <Link href="/export-info" className="hover:text-gold-600 transition-colors">
                        Export Process
                    </Link>
                    <Link href="/reviews" className="hover:text-gold-600 transition-colors">
                        Reviews
                    </Link>
                    <Link href="/journal" className="hover:text-gold-600 transition-colors">
                        Journal
                    </Link>
                </nav>

                {/* Aksi / Tombol */}
                <div className="flex items-center space-x-4 shrink-0">

                    {/* Currency / Lang */}
                    <div className="hidden md:flex text-xs font-semibold border-r border-green-200 pr-4 space-x-2">
                        <button
                            onClick={() => setCurrency('USD')}
                            className={cn("transition-colors", currency === 'USD' ? "text-green-800 font-bold" : "text-green-400 font-normal")}
                        >
                            USD
                        </button>
                        <span className="text-green-300">|</span>
                        <button
                            onClick={() => setCurrency('IDR')}
                            className={cn("transition-colors", currency === 'IDR' ? "text-green-800 font-bold" : "text-green-400 font-normal")}
                        >
                            IDR
                        </button>
                    </div>

                    <Link
                        href="/contact"
                        className="hidden md:inline-flex items-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        <Phone className="w-3 h-3 mr-2" />
                        B2B Quote
                    </Link>

                    {/* User Menu */}
                    {session?.user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="p-2 hover:bg-green-100 rounded-full transition-colors relative"
                            >
                                <UserIcon className="w-5 h-5 text-green-900" />
                                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-white"></span>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-green-100 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 border-b border-green-50">
                                        <p className="text-xs font-medium text-green-500">Signed in as</p>
                                        <p className="text-sm font-bold text-green-900 truncate">{session.user.name}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/profile/wishlist"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                    >
                                        <Heart className="w-4 h-4 mr-2" />
                                        My Wishlist
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-green-50"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 hover:bg-green-100 rounded-full transition-colors" title="Login / Register">
                            <UserIcon className="w-5 h-5 text-green-900" />
                        </Link>
                    )}

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

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-green-100 bg-white p-4 space-y-4">
                    {session?.user && (
                        <div className="flex items-center gap-3 pb-4 border-b border-green-50">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">
                                {session.user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-900">{session.user.name}</p>
                                <p className="text-xs text-green-500">{session.user.email}</p>
                            </div>
                        </div>
                    )}

                    <Link href="/catalog" className="block text-green-900 font-medium">Catalog</Link>
                    <Link href="/reviews" className="block text-green-900 font-medium">Reviews</Link>
                    <Link href="/about" className="block text-green-900 font-medium">About</Link>

                    {session?.user ? (
                        <>
                            <Link href="/profile" className="block text-green-900 font-medium">My Orders</Link>
                            <button onClick={() => signOut()} className="block text-red-600 font-medium w-full text-left">Sign Out</button>
                        </>
                    ) : (
                        <Link href="/login" className="block text-green-900 font-medium">Login / Register</Link>
                    )}

                    <Link href="/contact" className="block text-gold-600 font-bold">Request Quote</Link>
                    <div className="flex items-center space-x-4 pt-4 border-t border-green-50">
                        <span className="text-sm font-bold text-green-800 uppercase tracking-widest">Currency:</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrency('USD')}
                                className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", currency === 'USD' ? "bg-green-900 text-white" : "bg-green-100 text-green-800")}
                            >
                                USD
                            </button>
                            <button
                                onClick={() => setCurrency('IDR')}
                                className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", currency === 'IDR' ? "bg-green-900 text-white" : "bg-green-100 text-green-800")}
                            >
                                IDR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
