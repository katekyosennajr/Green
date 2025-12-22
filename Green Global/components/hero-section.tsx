import Link from 'next/link';
import { ArrowRight, ShieldCheck, Plane, FileCheck } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-green-950 text-cream-50">

            {/* Background Image & Gradient */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-[center_60%]"
                    aria-hidden="true"
                />
                {/* Gradient Overlay for Text Readability (Neutral/Black) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 py-20 md:py-32 flex flex-col justify-center h-full">
                <div className="max-w-2xl space-y-6 animate-slide-up">

                    <div className="inline-flex items-center space-x-2 bg-green-900/50 border border-green-700 rounded-full px-4 py-1.5 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-green-200">Official Exporter ID: 29910-330</span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-sm">
                        Source the Rarest <br />
                        <span className="text-gold-500 italic">Borneo Aroids</span>
                    </h1>

                    <p className="text-lg md:text-xl text-green-100 max-w-lg leading-relaxed">
                        We are a certified nursery exporting premium Scindapsus and rare plants directly from Indonesia to collectors worldwide.
                        <span className="block mt-2 font-medium text-white">Full Phytosanitary Documentation Included.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="/catalog"
                            className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-green-950 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-transform hover:scale-105"
                        >
                            Shop Catalog
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-colors"
                        >
                            Export Process
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bar Kredibilitas */}
            <div className="relative z-20 border-t border-white/10 bg-green-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <ShieldCheck className="w-8 h-8 text-gold-500" />
                            <div>
                                <h4 className="font-bold text-sm text-white uppercase">100% Live Guarantee</h4>
                                <p className="text-xs text-green-300">Replacement for DOA plants</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <FileCheck className="w-8 h-8 text-gold-500" />
                            <div>
                                <h4 className="font-bold text-sm text-white uppercase">Free Phyto Cert</h4>
                                <p className="text-xs text-green-300">Inspected by Indonesian Quarantine</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <Plane className="w-8 h-8 text-gold-500" />
                            <div>
                                <h4 className="font-bold text-sm text-white uppercase">DHL Express Shipping</h4>
                                <p className="text-xs text-green-300">Fast worldwide delivery (3-5 Days)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
