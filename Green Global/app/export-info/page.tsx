import Link from 'next/link';
import { CheckCircle, Clock, FileText, Plane, ShieldAlert } from 'lucide-react';

export default function ExportInfoPage() {
    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-4">Export & Shipping Guide</h1>
                    <p className="text-green-700 max-w-2xl mx-auto">
                        We make importing rare plants easy. Our experienced team handles the rigorous phytosanitary inspection and packaging process so you receive healthy plants.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">STEP 1</div>
                        <div className="bg-green-100 p-4 rounded-full shrink-0">
                            <FileText className="w-8 h-8 text-green-800" />
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">Phytosanitary Certification</h3>
                            <p className="text-green-700 leading-relaxed mb-4">
                                Every international order requires a Phytosanitary Certificate from the Indonesian Ministry of Agriculture. This document certifies that your plants are free from pests and diseases.
                            </p>
                            <ul className="space-y-2 text-sm text-green-600">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Included for free on all orders over $200.</li>
                                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-500" /> Processing time: 3-5 Working Days.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">STEP 2</div>
                        <div className="bg-green-100 p-4 rounded-full shrink-0">
                            <ShieldAlert className="w-8 h-8 text-green-800" />
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">Preparation & Packaging</h3>
                            <p className="text-green-700 leading-relaxed mb-4">
                                Plants are treated with anti-fungal and anti-stress solutions before packing. We ship <strong>Bare Root</strong> wrapped in sterile sphagnum moss.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-green-50 p-4 rounded-lg">
                                <div>
                                    <strong className="block text-green-900 mb-1">Layer 1:</strong>
                                    <span className="text-green-600">Moist Sphagnum Moss (Roots)</span>
                                </div>
                                <div>
                                    <strong className="block text-green-900 mb-1">Layer 2:</strong>
                                    <span className="text-green-600">Plastic Wrap & Tissue (Leaves)</span>
                                </div>
                                <div>
                                    <strong className="block text-green-900 mb-1">Layer 3:</strong>
                                    <span className="text-green-600">Thermal Insulation (Winter)</span>
                                </div>
                                <div>
                                    <strong className="block text-green-900 mb-1">Layer 4:</strong>
                                    <span className="text-green-600">Sturdy Cardboard Box</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">STEP 3</div>
                        <div className="bg-green-100 p-4 rounded-full shrink-0">
                            <Plane className="w-8 h-8 text-green-800" />
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-green-900 mb-3">DHS Express Shipping</h3>
                            <p className="text-green-700 leading-relaxed mb-4">
                                We use DHL Express Worldwide for the fastest and safest delivery. Once shipped, you will receive a tracking number instantly.
                            </p>
                            <ul className="space-y-2 text-sm text-green-600">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> USA & Canada: 3-5 Days</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Europe / UK: 4-6 Days</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Asia: 2-3 Days</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-green-600 mb-6">Have more questions about specific regulations in your country?</p>
                    <Link href="/contact" className="inline-block border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white px-8 py-3 rounded-full font-bold transition-colors">
                        Contact Export Team
                    </Link>
                </div>

            </div>
        </div>
    );
}
