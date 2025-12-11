import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ProductGallery } from '@/components/product-gallery';
import { ExportInfoTabs } from '@/components/export-info-tabs';
import { ShieldCheck, Check } from 'lucide-react';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { PriceDisplay } from '@/components/price-display';
import { getProduct } from '@/lib/products';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    let mainImage = '/og-image.jpg';
    try {
        const images = JSON.parse(product.images as string);
        if (Array.isArray(images) && images.length > 0) {
            mainImage = images[0];
        }
    } catch {
        // Fallback
    }

    return {
        title: product.name,
        description: `${product.name} (${product.scientificName}). ${product.description.substring(0, 140)}...`,
        openGraph: {
            title: `${product.name} | Global Green Exporter`,
            description: `Buy ${product.scientificName} directly from Indonesia. Phytosanitary certified.`,
            images: [
                {
                    url: mainImage,
                    width: 800,
                    height: 600,
                    alt: product.name,
                }
            ],
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.slug);

    if (!product) {
        notFound();
    }

    let images: string[] = [];
    try {
        images = JSON.parse(product.images as string);
    } catch (e) {
        console.error("Failed to parse product images", e);
    }

    // Ensure at least one image to prevent gallery crash
    if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2664&auto=format&fit=crop'];
    }

    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4">

                {/* Breadcrumb (Simple) */}
                <div className="text-sm text-green-400 mb-8 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Link href="/catalog" className="hover:text-green-600 hover:underline transition-colors">Catalog</Link>
                    <span>/</span>
                    <span className="text-green-800">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Gallery */}
                    <div>
                        <ProductGallery images={images} />
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-lg text-green-500 italic font-serif">
                                {product.scientificName}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4 border-y border-green-100 py-6">
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'}`}>
                                {product.stock > 0 ? `In Stock: ${product.stock}` : `Stock: ${product.stock}`}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <AddToCartButton product={{
                                id: product.id,
                                name: product.name,
                                priceUsd: product.priceUsd,
                                images: product.images as string,
                                slug: product.slug
                            }} />
                            <button className="w-full bg-transparent border-2 border-green-800 text-green-800 hover:bg-green-50 font-bold py-4 rounded-full transition-all">
                                Request B2B / Wholesale Quote
                            </button>
                        </div>

                        {/* Trust Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
                                <p className="text-xs text-green-700"><strong>Genetic Guarantee.</strong> Authentic species verified by experts.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-gold-500 shrink-0" />
                                <p className="text-xs text-green-700"><strong>Free Phytosanitary.</strong> Certificate included for legal entry.</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-green">
                            <h3 className="font-serif text-xl font-bold text-green-900">About this Plant</h3>
                            <p className="text-green-800 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <ExportInfoTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}
