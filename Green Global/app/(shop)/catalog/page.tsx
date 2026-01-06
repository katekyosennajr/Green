import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { PriceDisplay } from '@/components/price-display';
import { getProducts, FilterOptions, SortOption } from '@/lib/products';
import { FilterSidebar } from '@/components/catalog/filter-sidebar';

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

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage(props: Props) {
    const searchParams = await props.searchParams;

    // Parse Filters safely
    const filters: FilterOptions = {
        category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
        query: typeof searchParams.query === 'string' ? searchParams.query : undefined,
        minPrice: typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined,
        maxPrice: typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined,
        sort: (typeof searchParams.sort === 'string' ? searchParams.sort : 'newest') as SortOption
    };

    const products = await getProducts(filters);

    return (
        <div className="bg-cream-50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-green-900 mb-4">Rare Plant Catalog</h1>
                    <p className="text-green-700 text-sm md:text-base">Explore our exclusive collection of Borneo Aroids. Each plant is ethically sourced and inspected for export.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Sidebar Filter */}
                    <aside className="w-full md:w-64 flex-shrink-0 sticky top-4">
                        <FilterSidebar />
                    </aside>

                    {/* Product Grid Area */}
                    <main className="flex-1 w-full">
                        {/* Results Count */}
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-sm text-green-600 font-bold">
                                Showing {products.length} results
                                {filters.query && <span> for "{filters.query}"</span>}
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: Product) => {
                                let images: string[] = [];
                                try {
                                    images = JSON.parse(product.images as string);
                                } catch (e) {
                                    images = [];
                                }
                                const mainImage = images[0] || '/images/hero-bg.jpg';

                                return (
                                    <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50 flex flex-col">
                                        <div className="relative aspect-square overflow-hidden bg-green-100">
                                            <Image
                                                src={mainImage}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <p className="text-xs text-green-500 font-medium mb-1 italic truncate">{product.scientificName}</p>
                                            <h3 className="font-serif text-lg font-bold text-green-900 mb-2 leading-tight group-hover:text-gold-600 transition-colors">
                                                <Link href={`/product/${product.slug}`}>
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <div className="mt-auto pt-3 flex items-center justify-between border-t border-green-50">
                                                <PriceDisplay amountUsd={product.priceUsd} className="text-lg font-bold text-green-800" />
                                                <Link href={`/product/${product.slug}`} className="p-2 bg-green-100 hover:bg-green-900 hover:text-white rounded-full transition-colors text-green-900">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-green-200">
                                <p className="text-green-800 font-bold mb-2">No plants found.</p>
                                <p className="text-green-500 text-sm">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
