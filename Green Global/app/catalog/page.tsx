import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { PriceDisplay } from '@/components/price-display';

const prisma = new PrismaClient();

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

async function getProducts() {
    try {
        return await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            where: { stock: { gt: 0 } }
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function CatalogPage() {
    const products = await getProducts();

    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-4">Rare Plant Catalog</h1>
                    <p className="text-green-700">Explore our exclusive collection of Borneo Aroids. Each plant is ethically sourced and inspected for export.</p>
                </div>

                {/* Filters (Mock) */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button className="px-6 py-2 rounded-full bg-green-900 text-white text-sm font-bold">All Plants</button>
                    <button className="px-6 py-2 rounded-full border border-green-200 text-green-800 hover:bg-green-100 text-sm font-medium transition-colors">Scindapsus</button>
                    <button className="px-6 py-2 rounded-full border border-green-200 text-green-800 hover:bg-green-100 text-sm font-medium transition-colors">Monstera</button>
                    <button className="px-6 py-2 rounded-full border border-green-200 text-green-800 hover:bg-green-100 text-sm font-medium transition-colors">Variegated</button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: Product) => {
                        const images: string[] = [];
                        // try {
                        //     images = JSON.parse(product.images as string);
                        // } catch (e) {
                        //     images = [];
                        // }
                        const mainImage = images[0] || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2664&auto=format&fit=crop';

                        return (
                            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50 flex flex-col">
                                <div className="relative aspect-square overflow-hidden bg-green-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <p className="text-xs text-green-500 font-medium mb-1 italic">{product.scientificName}</p>
                                    <h3 className="font-serif text-lg font-bold text-green-900 mb-2 leading-tight group-hover:text-gold-600 transition-colors">
                                        <Link href={`/product/${product.slug}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-green-50">
                                        <PriceDisplay amountUsd={product.priceUsd} className="text-xl font-bold text-green-800" />
                                        <Link href={`/product/${product.slug}`} className="p-2 bg-green-100 hover:bg-green-900 hover:text-white rounded-full transition-colors text-green-900">
                                            <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-green-500">No products found available for export.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
