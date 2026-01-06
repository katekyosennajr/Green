import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        location: "California, USA",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "I was skeptical about ordering plants internationally, but Green Global exceeded my expectations. The Scindapsus arrived in perfect condition, roots healthy, and the packaging was incredible. The phyto certificate was included as promised.",
        plantImage: "https://images.unsplash.com/photo-1593691509543-c55cead2e037?q=80&w=800&auto=format&fit=crop",
        plantName: "Scindapsus Jade Satin"
    },
    {
        id: 2,
        name: "Hiroshi Tanaka",
        location: "Tokyo, Japan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "Amazing quality. The variegation on the Monstera is stunning, exactly like the photos. Shipping to Japan was fast (4 days via DHL). Highly recommended for serious collectors.",
        plantImage: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
        plantName: "Monstera Aurea"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        location: "Barcelona, Spain",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "The communication was excellent throughout the process. They kept me updated on the phytosanitary inspection steps. The plants arrived fresh and barely stressed. Will order again!",
        plantImage: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?q=80&w=800&auto=format&fit=crop",
        plantName: "Philodendron Gloriosum"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Global Community</span>
                    <h2 className="font-serif text-4xl font-bold text-green-900">Trusted by Collectors Worldwide</h2>
                    <p className="text-green-600 max-w-2xl mx-auto">
                        See what our happy customers are saying about their unboxing experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((item) => (
                        <div key={item.id} className="bg-cream-50 rounded-2xl p-6 border border-green-50 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">

                            {/* User Info */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <Image
                                        src={item.avatar}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-900 leading-tight">{item.name}</h4>
                                    <p className="text-xs text-green-500 font-medium">{item.location}</p>
                                </div>
                                <div className="ml-auto flex">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                                    ))}
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="mb-6 flex-grow">
                                <Quote className="w-8 h-8 text-green-200 mb-2 opacity-50" />
                                <p className="text-green-800 text-sm leading-relaxed italic">
                                    "{item.text}"
                                </p>
                            </div>

                            {/* The Plant They Received */}
                            <div className="relative mt-auto">
                                <p className="text-xs font-bold text-green-900 mb-2 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    Received: {item.plantName}
                                </p>
                                <div className="relative w-full h-48 rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                                    <Image
                                        src={item.plantImage}
                                        alt={`Plant received by ${item.name}`}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Unboxing Badge/Overlay */}
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                        Verified Purchase
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
