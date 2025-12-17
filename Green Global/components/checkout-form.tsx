'use client';

import { createOrder } from '@/app/actions/order-actions';
import { useCart } from '@/components/cart-provider';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
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
                    Preparing Secure Payment...
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
    const [state, formAction] = useActionState(createOrder, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const [country, setCountry] = useState('International');
    const [selectedPayment, setSelectedPayment] = useState<string>('');

    const [showSuccess, setShowSuccess] = useState(false);

    const [showMockPopup, setShowMockPopup] = useState(false);

    useEffect(() => {
        console.log("Checkout Effect Triggered:", {
            success: state.success,
            token: state.paymentToken
        });

        if (state.success) {
            clearCart();
            formRef.current?.reset();

            // Handle MOCK MODE (Bypass Midtrans)
            if (state.paymentToken === 'MOCK_TOKEN_BYPASS') {
                console.log("Mock Payment Mode Activated");
                setShowMockPopup(true);
                // Simulate processing delay
                setTimeout(() => {
                    setShowMockPopup(false);
                    if (onSuccess) onSuccess();
                    setShowSuccess(true);
                }, 3000); // 3 seconds delay
                return;
            }

            // Handle Real Midtrans
            if (state.paymentToken) {
                // Wait for Snap to be available if it's not yet
                const snapInterval = setInterval(() => {
                    if (window.snap) {
                        clearInterval(snapInterval);
                        console.log("Snap is available, calling pay...");
                        window.snap.pay(state.paymentToken, {
                            onSuccess: function (result: any) {
                                console.log("Snap Success", result);
                                setShowSuccess(true);
                            },
                            onPending: function (result: any) {
                                console.log("Snap Pending", result);
                                setShowSuccess(true);
                            },
                            onError: function (result: any) {
                                console.error("Snap Error", result);
                                setShowSuccess(true);
                            },
                            onClose: function () {
                                console.log("Snap Closed");
                                if (onSuccess) onSuccess();
                                setShowSuccess(true);
                            }
                        });
                    } else {
                        console.log("Waiting for Snap.js...");
                    }
                }, 500); // Check every 500ms

                // Cleanup interval after 10s to avoid infinite loop
                setTimeout(() => clearInterval(snapInterval), 10000);

            } else {
                console.warn("No payment token provided.");
                // Fallback for unexpected nulls
                if (onSuccess) onSuccess();
                setShowSuccess(true);
            }
        }
    }, [state.success, state.paymentToken, clearCart, onSuccess]);

    // MOCK POPUP UI
    if (showMockPopup) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in border-t-4 border-green-600">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                    <p className="text-gray-500 mb-6">Connecting to secure gateway (Simulation)...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-green-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Order Confirmed!</h3>
                <p className="text-green-700 mb-4">Thank you for your purchase.</p>
                <p className="text-sm text-green-500">Order ID: <span className="font-mono text-green-800">{state.orderId}</span></p>
                <p className="text-xs text-green-400 mt-2">We will email you the phytosanitary details shortly.</p>
                {state.paymentToken && <p className="text-xs text-blue-500 mt-2">Please complete payment in the popup.</p>}
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
                {/* Logic: If Country is Indonesia, send IDR. Else USD. */}
                <input type="hidden" name="currency" value={country === 'Indonesia' ? 'IDR' : 'USD'} />
                <input type="hidden" name="totalAmount" value={country === 'Indonesia' ? (totalAmount * 16000) : totalAmount} />

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
                            onChange={(e) => {
                                setCountry(e.target.value);
                                setSelectedPayment(''); // Reset selection when country switches
                            }}
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
                    <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider text-center">
                        {country === 'International' ? 'Select Payment Method:' : 'Pilih Metode Pembayaran:'}
                    </p>
                    <input type="hidden" name="paymentPreference" value={selectedPayment} />

                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        {country === 'International' ? (
                            <>
                                {['VISA', 'Mastercard', 'JCB', 'Amex'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setSelectedPayment(method)}
                                        className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded transition-all border ${selectedPayment === method
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                            }`}
                                    >
                                        <CreditCard className="w-3 h-3" /> {method}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                {[
                                    { id: 'QRIS', icon: QrCode, color: 'text-gray-800' },
                                    { id: 'GoPay', icon: Wallet, color: 'text-blue-600' },
                                    { id: 'BCA', icon: Landmark, color: 'text-blue-800' },
                                    { id: 'Mandiri', icon: Landmark, color: 'text-blue-900' },
                                    { id: 'BNI', icon: Landmark, color: 'text-orange-600' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedPayment(method.id)}
                                        className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded transition-all border ${selectedPayment === method.id
                                            ? 'bg-green-50 border-green-500 text-green-800 shadow-sm ring-1 ring-green-500'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'
                                            }`}
                                    >
                                        <method.icon className={`w-3 h-3 ${selectedPayment === method.id ? '' : method.color}`} />
                                        {method.id}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <SubmitButton label={country === 'International' ? 'Place Order & Pay' : 'Bayar Sekarang'} />

                <p className="text-xs text-center text-green-400 mt-4">
                    By confirming, you agree to our Terms of Export.
                </p>
            </form>
        </div>
    );
}
