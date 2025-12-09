'use client';

import { useCart } from '@/components/cart-provider';
import { useCurrency } from '@/components/currency-provider';
import Link from 'next/link';
import { Trash2, ShieldCheck, CheckCircle } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout-form';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeItem, cartTotal, cartCount } = useCart();
    const { formatPrice, currency } = useCurrency();

    const [isSuccess, setIsSuccess] = useState(false);

    if (cartCount === 0 && !isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream-50 px-4">
                <h1 className="font-serif text-3xl text-green-900 mb-4">Your Cart is Empty</h1>
                <p className="text-green-600 mb-8">Looks like you haven&apos;t added any rare plants yet.</p>
                <Link href="/catalog" className="bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors">
                    Browse Catalog
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-green-50 px-4 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">Order Confirmed!</h1>
                <p className="text-xl text-green-700 mb-2">Thank you for your purchase.</p>
                <p className="text-green-600 mb-8">We will email you the phytosanitary details shortly.</p>
                <Link href="/catalog" className="bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const SHIPPING_COST_USD = 150;
    const finalTotal = cartTotal + SHIPPING_COST_USD;

    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-green-100 flex gap-4 items-center shadow-sm">
                                <div className="w-24 h-24 bg-green-50 rounded-lg overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif font-bold text-green-900 text-lg leading-tight">
                                        <Link href={`/product/${item.slug}`} className="hover:text-gold-600">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-green-500 text-sm mt-1">{formatPrice(item.price)}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-xs text-green-400 block mb-1">Qty</span>
                                    <span className="font-bold text-green-800">{item.quantity}</span>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="font-bold text-green-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-xl text-green-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 text-sm text-green-700 border-b border-green-50 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phytosanitary Cert</span>
                                    <span className="text-gold-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping (Flat Rate)</span>
                                    <span className="text-green-900 font-medium">{formatPrice(SHIPPING_COST_USD)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-green-900 mb-8">
                                <span>Total ({currency})</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>

                            <p className="text-xs text-green-500 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-gold-500" />
                                Secure Checkout via Stripe / PayPal
                            </p>

                            <div className="mt-6 pt-6 border-t border-green-50">
                                <h4 className="font-bold text-green-900 mb-4">Express Checkout</h4>
                                <CheckoutForm totalAmount={finalTotal} onSuccess={() => setIsSuccess(true)} />
                            </div>

                            <p className="text-center mt-4 text-xs text-green-400">
                                *Shipping costs will be finalized based on your address.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
