'use client';

import { createOrder } from '@/app/actions/order-actions';
import { useCart } from '@/components/cart-provider';
import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const initialState = {
    message: '',
    success: false,
    orderId: ''
};

function SubmitButton() {
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
                'Confirm Order'
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
    const [state, formAction] = useFormState(createOrder, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            clearCart();
            formRef.current?.reset();
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [state.success, clearCart, onSuccess]);

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
        <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm">
            <h3 className="font-bold text-xl text-green-900 mb-6 border-b border-green-50 pb-4">Shipping Details</h3>
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

                {state.message && !state.success && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {state.message}
                    </div>
                )}

                <SubmitButton />

                <p className="text-xs text-center text-green-400 mt-4">
                    By confirming, you agree to our Terms of Export.
                </p>
            </form>
        </div>
    );
}
