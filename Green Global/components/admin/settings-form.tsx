'use client';

import { updateSettings, AppSettings } from '@/app/actions/setting-actions';
import { Save, Globe, DollarSign, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SettingsForm({ settings }: { settings: AppSettings }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await updateSettings(formData);
            setMessage(result.message);
            setIsSuccess(result.success);
            if (result.success) {
                router.refresh();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <AlertCircle className="w-5 h-5" />
                    <p>{message}</p>
                </div>
            )}

            {/* 1. General Info */}
            <div className="bg-white p-6 rounded-xl border border-green-50 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-green-50 pb-2">
                    <Globe className="w-5 h-5 text-gold-500" />
                    <h2 className="font-bold text-green-900">General Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-green-800 mb-1">Website Name</label>
                        <input
                            name="siteName"
                            defaultValue={settings.siteName}
                            className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-green-800 mb-1">Meta Description (SEO)</label>
                        <textarea
                            name="siteDescription"
                            defaultValue={settings.siteDescription}
                            rows={2}
                            className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Localization & Currency */}
            <div className="bg-white p-6 rounded-xl border border-green-50 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-green-50 pb-2">
                    <DollarSign className="w-5 h-5 text-gold-500" />
                    <h2 className="font-bold text-green-900">Currency & Export</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">Exchange Rate (1 USD = ? IDR)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                            <input
                                name="currencyRate"
                                type="number"
                                defaultValue={settings.currencyRate}
                                className="w-full border border-green-200 rounded-lg pl-10 p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <p className="text-xs text-green-500 mt-1">Used for auto-converting prices.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">Phytosanitary Cost (USD)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                                name="phytoCost"
                                type="number"
                                defaultValue={settings.phytoCost}
                                className="w-full border border-green-200 rounded-lg pl-8 p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Support Contact */}
            <div className="bg-white p-6 rounded-xl border border-green-50 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-green-50 pb-2">
                    <Mail className="w-5 h-5 text-gold-500" />
                    <h2 className="font-bold text-green-900">Contact Support</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">Support Email</label>
                        <input
                            name="contactEmail"
                            type="email"
                            defaultValue={settings.contactEmail}
                            className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">WhatsApp / Phone</label>
                        <input
                            name="contactPhone"
                            defaultValue={settings.contactPhone}
                            className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-green-800 mb-1">Shipping Policy Summary</label>
                        <textarea
                            name="shippingPolicy"
                            defaultValue={settings.shippingPolicy}
                            rows={3}
                            className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-green-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gold-600 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
