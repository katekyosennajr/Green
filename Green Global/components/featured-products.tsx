import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import { PriceDisplay } from '@/components/price-display';
import { QuickAddToCartButton } from '@/components/quick-add-to-cart-button';

interface Product {
    id: string;
    name: string;
    scientificName: string | null;
    priceUsd: number;
    stock: number;
    images: string;
    slug: string;
    description: string;
}

// Ini adalah Komponen Server
export async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    return (
        <section className="py-20 bg-cream-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-green-600 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Selection</span>
                        <h2 className="font-serif text-4xl font-bold text-green-900">Featured Rare Plants</h2>
                    </div>
                    <Link href="/catalog" className="hidden md:inline-flex text-green-700 hover:text-gold-600 font-bold border-b border-green-700 hover:border-gold-600 pb-1 transition-colors">
                        View All Plants
                    </Link>
                </div>

                {products.length === 0 ? (
                    <p className="text-center text-green-700">Loading catalog...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product: Product) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images as string);
                            } catch (e) {
                                images = [];
                            }
                            const mainImage = images[0] || '/images/hero-bg.jpg';

                            return (
                                <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-green-100">
                                        <Image
                                            src={mainImage}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {product.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                                <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase">Sold Out</span>
                                            </div>
                                        )}
                                        <QuickAddToCartButton
                                            product={{
                                                id: product.id,
                                                name: product.name,
                                                priceUsd: product.priceUsd,
                                                images: product.images,
                                                slug: product.slug,
                                                scientificName: product.scientificName || undefined
                                            }}
                                            className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <p className="text-xs text-green-500 font-medium mb-1 italic">{product.scientificName}</p>
                                        <h3 className="font-serif text-lg font-bold text-green-900 mb-2 leading-tight group-hover:text-gold-600 transition-colors">
                                            <Link href={`/product/${product.slug}`}>
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center justify-between mt-4 border-t border-green-50 pt-4">
                                            <PriceDisplay amountUsd={product.priceUsd} className="text-green-800 font-bold text-lg" />
                                            <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-600'}`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link href="/catalog" className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-sm">
                        View Full Catalog
                    </Link>
                </div>
            </div>
        </section>
    );
}
