import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient();

export const getFeaturedProducts = unstable_cache(
    async () => {
        try {
            const products = await prisma.product.findMany({
                where: {
                    isFeatured: true,
                    stock: { gt: 0 }
                },
                take: 4,
                orderBy: { createdAt: 'desc' }
            });
            console.log(`[DEBUG] Fetched ${products.length} featured products`);
            return products;
        } catch (error) {
            console.error("Failed to fetch featured products:", error);
            return [];
        }
    },
    ['featured-products-v5'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = async (category?: string) => {
    const cachedFn = unstable_cache(
        async () => {
            try {
                const where: any = { stock: { gt: 0 } };

                if (category) {
                    // Make robust: Capitalize first letter to match DB convention if user types lowercase
                    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

                    if (normalizedCategory === 'Variegated') {
                        where.OR = [
                            { name: { contains: 'Variegated' } },
                            { description: { contains: 'Variegated' } }
                        ];
                    } else {
                        where.category = normalizedCategory;
                    }
                }

                const products = await prisma.product.findMany({
                    orderBy: { createdAt: 'desc' },
                    where
                });
                console.log(`[DEBUG] Fetched ${products.length} products for category: ${category || 'ALL'}`);
                return products;
            } catch (error) {
                console.error("Failed to fetch products:", error);
                return [];
            }
        },
        [`all-products-v5-${category || 'all'}`],
        { revalidate: 3600, tags: ['products'] }
    );
    return cachedFn();
};

export const getProduct = async (slug: string) => {
    const cachedFn = unstable_cache(
        async () => {
            try {
                return await prisma.product.findUnique({
                    where: { slug }
                });
            } catch (error) {
                console.error("Failed to fetch product:", error);
                return null;
            }
        },
        [`product-view-v5-${slug}`],
        { revalidate: 3600, tags: ['products'] }
    );
    return cachedFn();
};
