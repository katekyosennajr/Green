'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Toggle a product in the user's wishlist
 */
export async function toggleWishlist(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("You must be logged in to manage your wishlist.");
    }

    const userId = session.user.id;

    const existingItem = await prisma.wishlistItem.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });

    if (existingItem) {
        // Remove
        await prisma.wishlistItem.delete({
            where: { id: existingItem.id },
        });
    } else {
        // Add
        await prisma.wishlistItem.create({
            data: {
                userId,
                productId,
            },
        });
    }

    revalidatePath('/profile/wishlist');
    revalidatePath(`/product/${productId}`); // How to revalidate specific product page? Ideally we pass slug, but productId is safer. Only issue is revalidating the path requires the slug.
    // For now, simple revalidation. The button will use optimistic updates anyway.
    return !existingItem; // Returns true if added, false if removed
}

/**
 * Get the current user's wishlist with product details
 */
export async function getUserWishlist() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const wishlist = await prisma.wishlistItem.findMany({
        where: { userId: session.user.id },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    priceUsd: true,
                    images: true,
                    category: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return wishlist.map(item => item.product); // Return just the products
}

/**
 * Check if a specific product is wishlisted
 */
export async function checkWishlistStatus(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return false;

    const count = await prisma.wishlistItem.count({
        where: {
            userId: session.user.id,
            productId,
        }
    });

    return count > 0;
}
