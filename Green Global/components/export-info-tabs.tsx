'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Thermometer, Truck } from 'lucide-react';

export function ExportInfoTabs() {
    const [activeTab, setActiveTab] = useState<'shipping' | 'phyto' | 'care'>('shipping');

    return (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-green-50 overflow-hidden">
            <div className="flex border-b border-green-100">
                <button
                    onClick={() => setActiveTab('shipping')}
                    className={cn(
                        "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                        activeTab === 'shipping' ? "bg-green-50 text-green-900 border-b-2 border-gold-500" : "text-green-400 hover:text-green-700"
                    )}
                >
                    <Truck className="w-4 h-4" /> Shipping Condition
                </button>
                <button
                    onClick={() => setActiveTab('phyto')}
                    className={cn(
                        "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                        activeTab === 'phyto' ? "bg-green-50 text-green-900 border-b-2 border-gold-500" : "text-green-400 hover:text-green-700"
                    )}
                >
                    <FileText className="w-4 h-4" /> Documents
                </button>
                <button
                    onClick={() => setActiveTab('care')}
                    className={cn(
                        "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                        activeTab === 'care' ? "bg-green-50 text-green-900 border-b-2 border-gold-500" : "text-green-400 hover:text-green-700"
                    )}
                >
                    <Thermometer className="w-4 h-4" /> Acclimatization
                </button>
            </div>

            <div className="p-8 min-h-[200px] text-green-800 leading-relaxed">
                {activeTab === 'shipping' && (
                    <div className="animate-fade-in space-y-4">
                        <p><strong>Standard: Bare Root with Sphagnum Moss</strong></p>
                        <p>To comply with international agricultural regulations, all plants are shipped bare root (without soil). Roots are wrapped in sterilized, moist sphagnum moss and secured in plastic to maintain humidity during transit.</p>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 mt-4">
                            <h4 className="font-bold text-green-900 text-sm mb-1">Winter Shipping</h4>
                            <p className="text-xs">Thermal insulation is added automatically for destinations with temperatures below 10°C.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'phyto' && (
                    <div className="animate-fade-in space-y-4">
                        <p><strong>Phytosanitary Certificate is INCLUDED.</strong></p>
                        <p>We process the inspection with the Indonesian Agency for Agricultural Quarantine. This process ensures your plant is free from pests and diseases.</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>Processing time: 3-5 working days.</li>
                            <li>No extra fee for orders above $200.</li>
                            <li>We provide digital copies via email before shipment.</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'care' && (
                    <div className="animate-fade-in space-y-4">
                        <p><strong>Upon Arrival:</strong></p>
                        <ol className="list-decimal pl-5 space-y-2 text-sm">
                            <li>Unbox immediately and check the roots.</li>
                            <li>Soak roots in room-temperature water with Vitamin B1 for 1 hour.</li>
                            <li>Pot into a chunky, airy aroid mix (Perlite, Pine Bark, Coco chunks).</li>
                            <li>Place in high humidity (70%+) and low light for the first week to recover from travel stress.</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}
