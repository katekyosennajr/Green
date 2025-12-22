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

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterOptions {
    category?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: SortOption;
}

export const getProducts = async (filters: FilterOptions | string = {}) => {
    // Normalize input: if string, treat as category
    const options: FilterOptions = typeof filters === 'string' ? { category: filters } : filters;
    const { category, query, minPrice, maxPrice, sort = 'newest' } = options;

    const cacheKey = `products-v6-${JSON.stringify(options)}`;

    const cachedFn = unstable_cache(
        async () => {
            try {
                const where: any = { stock: { gt: 0 } };

                // 1. Category Filter
                if (category) {
                    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
                    if (normalizedCategory === 'Variegated') {
                        where.OR = [
                            { name: { contains: 'Variegated' } },
                            { description: { contains: 'Variegated' } }
                        ];
                    } else if (normalizedCategory !== 'All') {
                        where.category = normalizedCategory;
                    }
                }

                // 2. Search Query (Name or Scientific Name)
                if (query) {
                    const searchCondition = {
                        OR: [
                            { name: { contains: query } },
                            { scientificName: { contains: query } }
                        ]
                    };

                    // Merge with existing OR if needed (complex)
                    // Prisma AND is safer to combine multiple ORs
                    if (where.OR) {
                        where.AND = [
                            { OR: where.OR },
                            searchCondition
                        ];
                        delete where.OR; // Move existing OR to AND
                    } else {
                        Object.assign(where, searchCondition);
                    }
                }

                // 3. Price Filter
                if (minPrice !== undefined || maxPrice !== undefined) {
                    where.priceUsd = {};
                    if (minPrice !== undefined) where.priceUsd.gte = minPrice;
                    if (maxPrice !== undefined) where.priceUsd.lte = maxPrice;
                }

                // 4. Sorting
                let orderBy: any = { createdAt: 'desc' };
                if (sort === 'price_asc') orderBy = { priceUsd: 'asc' };
                if (sort === 'price_desc') orderBy = { priceUsd: 'desc' };

                const products = await prisma.product.findMany({
                    orderBy,
                    where
                });

                console.log(`[DEBUG] Fetched ${products.length} products. Filters:`, options);
                return products;
            } catch (error) {
                console.error("Failed to fetch products:", error);
                return [];
            }
        },
        [cacheKey],
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
