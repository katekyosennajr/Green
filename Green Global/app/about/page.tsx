import Link from 'next/link';
import { Award, FileCheck, Users, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-cream-50 min-h-screen">
            {/* Hero */}
            <section className="bg-green-900 text-cream-50 py-20">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Cultivating Trust, Exporting Nature</h1>
                    <p className="text-xl text-green-100 leading-relaxed">
                        GlobalGreen Exporter is Borneo's premier licensed nursery, dedicated to sharing Indonesia's botanical treasures with the world's most discerning collectors.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-16">

                        {/* Story */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="font-serif text-3xl font-bold text-green-900">Our Roots in Borneo</h2>
                                <div className="space-y-4 text-green-800 leading-relaxed">
                                    <p>
                                        Established in 2020, our nursery is located in the heart of West Kalimantan, Borneo. Being native to the habitat of many <em>Scindapsus</em> and <em>Homalomena</em> species gives us a unique advantage: we understand exactly how these plants thrive.
                                    </p>
                                    <p>
                                        What started as a local conservation effort has grown into a global operation. We partner with local farmers to ensure sustainable propagation, preventing poaching while providing economic opportunities for our community.
                                    </p>
                                </div>
                            </div>
                            <div className="h-64 md:h-full bg-green-200 rounded-2xl overflow-hidden relative">
                                {/* Placeholder for nursery image */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-6 bg-white border border-green-100 rounded-xl text-center">
                                <Globe className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                                <div className="font-bold text-2xl text-green-900">30+</div>
                                <div className="text-xs text-green-500 uppercase tracking-wider">Countries Served</div>
                            </div>
                            <div className="p-6 bg-white border border-green-100 rounded-xl text-center">
                                <FileCheck className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                                <div className="font-bold text-2xl text-green-900">100%</div>
                                <div className="text-xs text-green-500 uppercase tracking-wider">Phyto Compliance</div>
                            </div>
                            <div className="p-6 bg-white border border-green-100 rounded-xl text-center">
                                <Users className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                                <div className="font-bold text-2xl text-green-900">500+</div>
                                <div className="text-xs text-green-500 uppercase tracking-wider">Happy Collectors</div>
                            </div>
                            <div className="p-6 bg-white border border-green-100 rounded-xl text-center">
                                <Award className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                                <div className="font-bold text-2xl text-green-900">Top Rated</div>
                                <div className="text-xs text-green-500 uppercase tracking-wider">On NatureEx</div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12 text-center">
                            <h3 className="font-serif text-2xl font-bold text-green-900 mb-4">Ready to expand your collection?</h3>
                            <p className="text-green-700 mb-8 max-w-xl mx-auto">Browse our catalog of acclimatized, export-ready plants. We handle all the paperwork for you.</p>
                            <Link href="/catalog" className="inline-block bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors">
                                View Catalog
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
