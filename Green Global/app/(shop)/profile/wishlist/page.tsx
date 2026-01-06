import { getUserWishlist } from '@/app/actions/wishlist-actions';
import Link from 'next/link';
import Image from 'next/image';
import { PriceDisplay } from '@/components/price-display';
import { WishlistButton } from '@/components/wishlist-button';
import { PackageOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/profile/wishlist');
    }

    const wishlistProducts = await getUserWishlist();

    return (
        <div className="bg-white min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8 border-b border-green-50 pb-4">
                    <h1 className="font-serif text-3xl font-bold text-green-900">My Wishlist</h1>
                    <Link href="/profile" className="text-sm font-bold text-green-600 hover:text-green-800">
                        Back to Profile
                    </Link>
                </div>

                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-20 bg-cream-50 rounded-2xl border border-dashed border-green-200">
                        <PackageOpen className="w-16 h-16 text-green-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-green-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-green-600 mb-8">Save items you want to see later.</p>
                        <Link href="/catalog" className="inline-block bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-colors">
                            Explore Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistProducts.map((product) => {
                            let mainImage = '/images/placeholder.jpg';
                            try {
                                const images = JSON.parse(product.images as string);
                                if (images.length > 0) mainImage = images[0];
                            } catch (e) { }

                            return (
                                <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden border border-green-50 hover:shadow-lg transition-all">
                                    <div className="relative aspect-square bg-green-100">
                                        <Image
                                            src={mainImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Remove Button */}
                                        <div className="absolute top-2 right-2">
                                            <WishlistButton
                                                productId={product.id}
                                                isWishlistedInitially={true}
                                                className="bg-white text-red-500 shadow-md hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-green-900 truncate mb-1">
                                            <Link href={`/product/${product.slug}`} className="hover:underline">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <PriceDisplay amountUsd={product.priceUsd} className="text-green-700 font-bold" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
