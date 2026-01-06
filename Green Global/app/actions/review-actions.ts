'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ReviewSchema = z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function createReview(userId: string, data: z.infer<typeof ReviewSchema>) {
    try {
        const { productId, rating, comment } = ReviewSchema.parse(data);

        // Check if user already reviewed this product?
        // Optional: Enforce one review per product per user
        /* 
        const existing = await prisma.review.findFirst({
            where: { userId, productId }
        });
        if (existing) throw new Error("You have already reviewed this product.");
        */

        const review = await prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment: comment || '',
            },
        });

        revalidatePath(`/product/${productId}`); // How to get slug? Revalidate by tag maybe better?
        // For now, simple revalidation. Ideally we know the slug.
        // Actually simpler: revalidateTag('products') or specific path if we passed slug.
        // Let's passed path or revalidate entire catalog.

        return { success: true, review };
    } catch (error) {
        console.error('Error creating review:', error);
        return { success: false, error: 'Failed to submit review' };
    }
}


export async function getProductReviews(productId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { name: true } // Assuming 'image' exists or just name
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return reviews;
    } catch (error) {
        return [];
    }
}

export async function getAllReviews() {
    try {
        const reviews = await prisma.review.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, city: true, country: true } },
                product: { select: { name: true, slug: true, images: true } }
            }
        });
        return reviews;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
}
