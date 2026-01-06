'use client';

import { useState } from 'react';
import { Package, User, MapPin, Phone, Save, Loader2, Calendar, ChevronRight } from 'lucide-react';
import { updateProfile } from '@/app/actions/user-actions';

type Order = {
    id: string;
    createdAt: Date;
    status: string;
    total: number;
    currency: string;
    items: any[];
};

type UserData = {
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
};

export function ProfileView({ user, orders }: { user: UserData, orders: Order[] }) {
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await updateProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Saved!' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed.' });
        }
        setIsSaving(false);
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 space-y-2">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-green-900 text-white shadow-lg shadow-green-900/20' : 'bg-white text-green-800 hover:bg-green-50'}`}
                >
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">My Orders</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-green-900 text-white shadow-lg shadow-green-900/20' : 'bg-white text-green-800 hover:bg-green-50'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Profile Settings</span>
                </button>
            </aside>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-green-900/5 border border-green-50">
                {activeTab === 'orders' ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">Order History</h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-12 bg-green-50/50 rounded-xl border border-dashed border-green-200">
                                <Package className="w-12 h-12 text-green-300 mx-auto mb-3" />
                                <p className="text-green-600 font-medium">No orders found yet.</p>
                                <p className="text-sm text-green-400">Start shopping to see your history here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="group border border-green-100 rounded-xl p-5 hover:border-gold-400 hover:shadow-md transition-all bg-cream-50/30">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono text-sm font-bold text-green-800">#{order.id.slice(-6).toUpperCase()}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-xs text-green-500 gap-4">
                                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{order.items.length} Items</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-green-900">Total</p>
                                                    <p className="font-serif font-bold text-lg text-gold-600">
                                                        {order.currency} {order.total.toLocaleString()}
                                                    </p>
                                                </div>
                                                {/* Requires Order Detail Page implementation for full functionality */}
                                                <button disabled className="p-2 bg-white border border-green-100 rounded-full text-green-300 cursor-not-allowed group-hover:text-green-500 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-serif font-bold text-green-900 mb-6">Profile Settings</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <input name="name" defaultValue={user.name || ''} className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                                        <User className="w-4 h-4 text-green-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Email (Read Only)</label>
                                    <div className="relative">
                                        <input disabled value={user.email || ''} className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed" />
                                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <input name="phone" placeholder="+62..." defaultValue={user.phone || ''} className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                                    <Phone className="w-4 h-4 text-green-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Shipping Address</label>
                                <div className="relative">
                                    <textarea name="address" rows={3} defaultValue={user.address || ''} className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Street name, number, etc." />
                                    <MapPin className="w-4 h-4 text-green-400 absolute left-3 top-4" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-green-800 uppercase tracking-wider">City</label>
                                    <input name="city" defaultValue={user.city || ''} className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Postal Code</label>
                                    <input name="postalCode" defaultValue={user.postalCode || ''} className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-xs font-bold text-green-800 uppercase tracking-wider">Country</label>
                                    <input name="country" defaultValue={user.country || ''} className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center justify-center space-x-2 bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
                                >
                                    {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                </button>

                                {message && (
                                    <span className={`text-sm font-medium animate-in fade-in slide-in-from-left-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                        {message.text}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
