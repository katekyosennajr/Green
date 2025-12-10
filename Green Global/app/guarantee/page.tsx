import { ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GuaranteePage() {
    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-6">Live Arrival Guarantee</h1>
                    <p className="text-xl text-green-700 italic">"Your peace of mind is our priority."</p>
                </div>

                <div className="bg-white p-10 rounded-2xl shadow-xl border border-gold-200 relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck className="w-64 h-64" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="font-serif text-3xl font-bold text-green-900 mb-6 flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-gold-500" />
                            100% Live Arrival Guarantee
                        </h2>
                        <p className="text-lg text-green-800 mb-6 leading-relaxed">
                            We understand the anxiety of ordering plants from overseas.
                            Global Green Exporter guarantees that your plants will arrive alive.
                            If a plant arrives dead or with severe rot that compromises survival, we will offer a <strong>Replacement</strong> or <strong>Full Refund</strong> for that plant.
                        </p>

                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-900 mb-2">Coverage Includes:</h4>
                            <ul className="list-disc list-inside text-green-700 space-y-2">
                                <li>Dead on Arrival (DOA).</li>
                                <li>Severe Root Rot (where the rhizome/stem is mushy).</li>
                                <li>Lost Packages (confirmed by DHL).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <RefreshCw className="w-10 h-10 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">Claim Process</h3>
                        <ol className="list-decimal list-inside text-green-700 space-y-3">
                            <li>Unbox your package immediately upon arrival.</li>
                            <li>Take clear photos/videos of the box and the plant (roots, stem, leaves).</li>
                            <li>Email us at <strong className="text-green-900">claims@globalgreen.com</strong> within <strong>24 hours</strong> of delivery.</li>
                            <li>Our team will assess the condition and approve the claim within 1 business day.</li>
                        </ol>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <AlertTriangle className="w-10 h-10 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">Exclusions</h3>
                        <p className="text-green-700 mb-4">The guarantee does NOT cover minor cosmetic damage such as:</p>
                        <ul className="list-disc list-inside text-green-700 space-y-2 text-sm">
                            <li>Yellowing of a single old leaf (stress).</li>
                            <li>Minor mechanical damage during shipping (bent petiole).</li>
                            <li>Cold damage if buyer refused heat pack advice.</li>
                            <li>Failure to acclimate properly after arrival.</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center bg-green-900 text-cream-50 p-10 rounded-2xl">
                    <h3 className="font-serif text-2xl font-bold mb-4">Ready to Order with Confidence?</h3>
                    <p className="mb-8 max-w-2xl mx-auto">Join thousands of happy collectors worldwide who trust Global Green Exporter.</p>
                    <Link href="/catalog" className="bg-gold-500 text-green-950 px-8 py-4 rounded-full font-bold hover:bg-white transition-colors inline-block">
                        Browse Rare Plants
                    </Link>
                </div>
            </div>
        </div>
    );
}
