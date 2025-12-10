import Link from 'next/link';
import { Truck, Briefcase, Percent } from 'lucide-react';

export default function WholesalePage() {
    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <span className="text-gold-600 font-bold tracking-widest uppercase text-sm mb-2 block">B2B Partnership</span>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-6">Wholesale & Resellers</h1>
                        <p className="text-lg text-green-700 mb-6 leading-relaxed">
                            Looking to stock your nursery or plant shop with rare tropicals?
                            Global Green Exporter offers exclusive wholesale pricing for bulk orders.
                            We supply garden centers across USA, Europe, and Asia.
                        </p>
                        <Link href="/contact" className="bg-green-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gold-600 transition-colors inline-block">
                            Apply for Wholesale Account
                        </Link>
                    </div>
                    <div className="relative h-[400px] bg-green-200 rounded-2xl overflow-hidden shadow-xl">
                        {/* Placeholder for Wholesale Image */}
                        <div className="absolute inset-0 bg-green-900/20 flex items-center justify-center">
                            <span className="text-white/50 font-serif text-4xl">Wholesale Nursery</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-2xl shadow-sm border border-green-50">
                    <h2 className="font-serif text-3xl font-bold text-green-900 mb-8 text-center">Why Partner With Us?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Percent className="w-8 h-8 text-gold-500" />
                            </div>
                            <h3 className="font-bold text-xl text-green-900 mb-2">Volume Discounts</h3>
                            <p className="text-green-600">Save up to 40% off retail prices. Minimum Order Quantity (MOQ) starts at just $1,500.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-gold-500" />
                            </div>
                            <h3 className="font-bold text-xl text-green-900 mb-2">Air Cargo Solutions</h3>
                            <p className="text-green-600">For large shipments (&gt;50kg), we coordinate Air Cargo to your nearest international airport for cost efficiency.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gold-500" />
                            </div>
                            <h3 className="font-bold text-xl text-green-900 mb-2">Priority Sourcing</h3>
                            <p className="text-green-600">Get early access to new releases (`Monstera Mint`, `Scindapsus Snake Scale`) before they hit the retail site.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
