import { Plane, Archive, FileCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-6">Shipping & Phytosanitary</h1>
                    <p className="text-xl text-green-700 italic">"Delivering tropical nature safely to your doorstep."</p>
                </div>

                {/* Main Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <FileCheck className="w-12 h-12 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">1. Phytosanitary Certificate</h3>
                        <p className="text-green-700 leading-relaxed">
                            Every plant export requires a Phytosanitary Certificate from the Indonesian Ministry of Agriculture.
                            We handle this entire process for you. Typically, inspection and certificate issuance take <strong>3-5 working days</strong>.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <Archive className="w-12 h-12 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">2. Professional Packing</h3>
                        <p className="text-green-700 leading-relaxed">
                            Plants are treated with anti-fungal solution and roots are wrapped in moist sphagnum moss.
                            We use 4-layer thermal insulation and sturdy boxes to protect against temperature fluctuations during transit.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <Plane className="w-12 h-12 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">3. DHL Express Shipping</h3>
                        <p className="text-green-700 leading-relaxed">
                            We ship exclusively via DHL Express for the fastest transit times (usually 3-6 days to USA/EU).
                            You will receive a tracking number as soon as your package is dispatched.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-50">
                        <Calendar className="w-12 h-12 text-gold-500 mb-4" />
                        <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">4. Total Timeline</h3>
                        <p className="text-green-700 leading-relaxed">
                            From order confirmation to arrival, the process typically takes <strong>7-14 days</strong>.
                            (3-5 days for permit/phyto + 3-6 days shipping).
                        </p>
                    </div>
                </div>

                {/* Detailed FAQ for Shipping */}
                <div className="prose prose-green max-w-none bg-white p-10 rounded-2xl shadow-sm border border-green-50">
                    <h2 className="font-serif text-3xl font-bold text-green-900 mb-6">Shipping Policy Details</h2>

                    <h3 className="text-green-800">Do I need an import permit?</h3>
                    <p>
                        <strong>USA:</strong> For orders below 12 plants, no import permit is usually required. If you order more than 12, an Import Permit is mandatory. <br />
                        <strong>EU/UK/Canada:</strong> Regulations vary. We generally recommend checking your local customs office. We attach the Phytosanitary Certificate to every shipment to comply with international laws.
                    </p>

                    <h3 className="text-green-800">What happens if the package is held by customs?</h3>
                    <p>
                        While we ensure all paperwork is perfect, customs inspections are out of our control.
                        In the rare event of a seizure due to paperwork error on our side, we offer a full refund or re-shipment.
                        Delays due to buyer's failure to pay import duties (if any) are the buyer's responsibility.
                    </p>

                    <h3 className="text-green-800">Winter Shipping</h3>
                    <p>
                        We include heat packs free of charge during winter months for destinations in the Northern Hemisphere.
                        However, we may hold shipping if severe weather warnings are in effect at the destination hub.
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/catalog" className="bg-green-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gold-600 transition-colors inline-block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
