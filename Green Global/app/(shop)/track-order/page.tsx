'use client';

import { useState } from 'react';
import { trackOrder, TrackingResult } from '@/app/actions/order-actions';
import { Search, Package, Calendar, Truck, CheckCircle, FileText, Anchor } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const STEPS = [
    { id: 'PENDING', label: 'Order Received', icon: FileText },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'PHYTO_IN_PROGRESS', label: 'Phytosanitary', icon: Anchor },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [result, setResult] = useState<TrackingResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        try {
            const res = await trackOrder(orderId);
            setResult(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentStepIndex = (status: string) => {
        return STEPS.findIndex(step => step.id === status);
    };

    const currentStepIndex = result?.order ? getCurrentStepIndex(result.order.status) : -1;

    return (
        <div className="bg-cream-50 min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl font-bold text-green-900 mb-4">Track Your Shipment</h1>
                    <p className="text-green-600">Enter your Order ID to see the current status of your plants.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-50 mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Order ID (e.g. ORD-123...)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all font-medium text-green-900 placeholder:text-green-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Track Now'
                            )}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {hasSearched && !isLoading && !result?.found && (
                    <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100 text-red-600 font-medium animate-in fade-in slide-in-from-bottom-2">
                        Order not found. Please check your ID and try again.
                    </div>
                )}

                {hasSearched && result?.found && result.order && (
                    <div className="bg-white rounded-2xl shadow-xl border border-green-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                        {/* Header Info */}
                        <div className="bg-green-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-green-300 text-xs uppercase tracking-widest font-bold mb-1">Order ID</p>
                                <p className="font-mono text-xl">{result.order.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-300 text-xs uppercase tracking-widest font-bold mb-1">Date Placed</p>
                                <div className="flex items-center text-sm font-medium">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {format(new Date(result.order.createdAt), 'MMM d, yyyy')}
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Timeline */}
                            <div className="relative mb-16">
                                {/* Progress Bar Background */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-green-100 -translate-y-1/2 rounded-full hidden md:block" />

                                {/* Active Progress */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-1000"
                                    style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}
                                />

                                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                                    {STEPS.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.id} className={cn(
                                                "flex md:flex-col items-center gap-4 md:gap-2 transition-colors duration-500",
                                                isActive ? "text-green-900" : "text-green-200"
                                            )}>
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                                                    isActive ? "bg-white border-gold-500 shadow-lg scale-110" : "bg-green-50 border-white",
                                                    isCurrent && "ring-4 ring-gold-200"
                                                )}>
                                                    <Icon className={cn("w-5 h-5", isActive ? "text-gold-500" : "text-green-200")} />
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold uppercase tracking-wider",
                                                    isCurrent && "text-gold-600"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tracking Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-green-50/50 p-6 rounded-xl border border-green-50">
                                <div>
                                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                                        <Truck className="w-4 h-4 mr-2" />
                                        Shipping Info
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between">
                                            <span className="text-green-600">Courier</span>
                                            <span className="font-bold text-green-900">{result.order.shippingCourier || 'Not assigned yet'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-green-600">Tracking No.</span>
                                            <span className="font-bold text-green-900 font-mono">{result.order.trackingNumber || 'Pending'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-green-600">Phyto. Cert</span>
                                            <span className="font-bold text-green-900 font-mono">{result.order.phytoCertNumber || 'Processing'}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                                        <Package className="w-4 h-4 mr-2" />
                                        Items ({result.order.items.length})
                                    </h3>
                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {result.order.items.map((item, i) => {
                                            let mainImage = '/images/placeholder.jpg';
                                            try {
                                                const imgs = JSON.parse(item.product.images);
                                                if (imgs.length > 0) mainImage = imgs[0];
                                            } catch (e) { }

                                            return (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white shrink-0">
                                                        <Image src={mainImage} alt={item.product.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-green-900 truncate">{item.product.name}</p>
                                                        <p className="text-xs text-green-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
