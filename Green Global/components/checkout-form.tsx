'use client';

import { createOrder } from '@/app/actions/order-actions';
import { useCart } from '@/components/cart-provider';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import Script from 'next/script';

// Tambah tipe global untuk Snap
declare global {
    interface Window {
        snap: any;
    }
}

import { CreditCard, Wallet, QrCode, Landmark } from 'lucide-react';
import { useCurrency } from '@/components/currency-provider';

interface FormState {
    message: string;
    success: boolean;
    orderId?: string | null;
    paymentToken?: string | null;
}

const initialState: FormState = {
    message: '',
    success: false,
    orderId: undefined,
    paymentToken: undefined
};

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-900 text-white py-4 rounded-full font-bold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Processing...
                </>
            ) : (
                label
            )}
        </button>
    );
}

interface CheckoutFormProps {
    totalAmount: number;
    onSuccess?: () => void;
}

export function CheckoutForm({ totalAmount, onSuccess }: CheckoutFormProps) {
    const { items, clearCart } = useCart();
    const { currency } = useCurrency();
    const [state, formAction] = useFormState(createOrder, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const [country, setCountry] = useState('International'); // Default ke Internasional sesuai fokus ekspor

    useEffect(() => {
        if (state.success) {
            clearCart();
            formRef.current?.reset();

            // Handle Pembayaran
            if (state.paymentToken) {
                // Cek apakah snap sudah dimuat
                if (window.snap) {
                    window.snap.pay(state.paymentToken, {
                        onSuccess: function (result: any) { alert('Payment Success!'); console.log(result); },
                        onPending: function (result: any) { alert('Waiting for Payment!'); console.log(result); },
                        onError: function (result: any) { alert('Payment Failed!'); console.log(result); },
                        onClose: function () {
                            console.log('Customer closed the popup without finishing the payment');
                            // Tetap sukses order placement, biarkan lanjut
                            if (onSuccess) onSuccess();
                        }
                    });
                } else {
                    console.error("Snap JS not loaded!");
                    if (onSuccess) onSuccess(); // Fallback ke tampilan sukses
                }
            } else {
                if (onSuccess) onSuccess();
            }
        }
    }, [state.success, state.paymentToken, clearCart, onSuccess]);

    if (state.success) {
        return (
            <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Order Confirmed!</h3>
                <p className="text-green-700 mb-4">Thank you for your purchase.</p>
                <p className="text-sm text-green-500">Order ID: <span className="font-mono text-green-800">{state.orderId}</span></p>
                <p className="text-xs text-green-400 mt-2">We will email you the phytosanitary details shortly.</p>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50">
            {/* Script Midtrans Snap - URL Sandbox */}
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-dummy-key'}
                strategy="lazyOnload"
            />

            <h3 className="font-serif text-xl font-bold text-green-900 mb-6">Checkout Details</h3>
            <form action={formAction} ref={formRef} className="space-y-4">
                <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
                <input type="hidden" name="totalUsd" value={totalAmount} />

                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Full Name</label>
                    <input name="name" required className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Plant Collector" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Email Address</label>
                    <input name="email" type="email" required className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="you@example.com" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Shipping Address</label>
                    <textarea name="address" required rows={3} className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Full street address, City, Country" />
                </div>

                {/* Pilihan Negara & Pengiriman */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">Country</label>
                        <select
                            name="country"
                            className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white"
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                        >
                            <option value="International">International (Outside Indonesia)</option>
                            <option value="Indonesia">Indonesia</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">Shipping Courier</label>
                        <div className="flex flex-col gap-2 mt-2">
                            {country === 'Indonesia' ? (
                                <>
                                    <label className="flex items-center gap-2 border border-green-100 p-3 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                                        <input type="radio" name="courier" value="JNE" defaultChecked className="text-green-600 focus:ring-green-500" />
                                        <span className="font-bold text-green-900">JNE</span>
                                        <span className="text-xs text-green-600 ml-auto">Domestic</span>
                                    </label>
                                    <label className="flex items-center gap-2 border border-green-100 p-3 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                                        <input type="radio" name="courier" value="J&T" className="text-green-600 focus:ring-green-500" />
                                        <span className="font-bold text-green-900">J&T Express</span>
                                        <span className="text-xs text-green-600 ml-auto">Domestic</span>
                                    </label>
                                </>
                            ) : (
                                <label className="flex items-center gap-2 border border-green-100 p-3 rounded-lg cursor-pointer bg-green-50 border-green-200 transition-colors">
                                    <input type="radio" name="courier" value="DHL Express" defaultChecked className="text-green-600 focus:ring-green-500" />
                                    <span className="font-bold text-green-900">DHL Express</span>
                                    <span className="text-xs text-green-600 ml-auto">International</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {state.message && !state.success && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {state.message}
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-3">
                        {currency === 'USD' ? 'Accepted International Payments:' : 'Metode Pembayaran Lokal:'}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                        {currency === 'USD' ? (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-blue-800 flex items-center gap-1"><CreditCard className="w-3 h-3" /> VISA</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-red-600 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Mastercard</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-blue-500">Amex</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-green-600 flex items-center gap-1"><CreditCard className="w-3 h-3" /> JCB</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1"><QrCode className="w-3 h-3" /> QRIS</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-blue-600 flex items-center gap-1"><Wallet className="w-3 h-3" /> GoPay</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-blue-800 flex items-center gap-1"><Landmark className="w-3 h-3" /> BCA</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-blue-900 flex items-center gap-1"><Landmark className="w-3 h-3" /> Mandiri</span>
                                    <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-orange-600 flex items-center gap-1"><Landmark className="w-3 h-3" /> BNI</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <SubmitButton label={currency === 'USD' ? 'Confirm Order' : 'Lanjut ke Pembayaran'} />

                <p className="text-xs text-center text-green-400 mt-4">
                    By confirming, you agree to our Terms of Export.
                </p>
            </form>
        </div>
    );
}
