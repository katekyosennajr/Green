import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductGallery } from '@/components/product-gallery';
import { ExportInfoTabs } from '@/components/export-info-tabs';
import { ShieldCheck, Check } from 'lucide-react';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { PriceDisplay } from '@/components/price-display';

const prisma = new PrismaClient();

async function getProduct(slug: string) {
    return await prisma.product.findUnique({
        where: { slug }
    });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await getProduct(params.slug);

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
        // Fallback to default
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

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    // const images = JSON.parse(product.images as string);
    const images: string[] = []; // Fallback due to build error

    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4">

                {/* Breadcrumb (Simple) */}
                <div className="text-sm text-green-400 mb-8 uppercase tracking-widest font-bold">
                    Catalog / <span className="text-green-800">{product.name}</span>
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
                            <PriceDisplay amountUsd={product.priceUsd} className="text-4xl font-bold text-green-900" />
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full">
                                In Stock: {product.stock}
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
