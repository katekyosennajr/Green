'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Define state type for useActionState
export type State = {
    message?: string;
    success?: boolean;
    errors?: {
        name?: string;
        price?: string;
        stock?: string;
    };
}

export async function createProduct(formData: FormData): Promise<State> {
    const name = formData.get('name') as string;
    const scientificName = formData.get('scientificName') as string;
    const priceRaw = formData.get('price') as string;
    const stockRaw = formData.get('stock') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string; // Add category
    const imagesRaw = formData.get('images') as string;

    // Basic Validation
    console.log('[CreateProduct] Received:', { name, priceRaw, stockRaw });

    if (!name || name.length < 3) {
        console.log('[CreateProduct] Error: Name too short');
        return { success: false, message: 'Name must be at least 3 characters', errors: { name: 'Name too short' } };
    }
    if (!priceRaw || isNaN(parseFloat(priceRaw))) {
        console.log('[CreateProduct] Error: Invalid price');
        return { success: false, message: 'Invalid price', errors: { price: 'Enter a valid number' } };
    }

    const price = parseFloat(priceRaw);
    const stock = parseInt(stockRaw) || 0;

    // Simplified image handling for demo
    const imagesValues = imagesRaw?.split(',').map(s => s.trim()).filter(Boolean);
    const images = JSON.stringify(imagesValues.length > 0 ? imagesValues : ['/images/placeholder.jpg']);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    try {
        await prisma.product.create({
            data: {
                name,
                scientificName,
                priceUsd: price,
                stock,
                description,
                category, // Save category
                images,
                slug,
                phytoIncluded: true,
                shippingInfo: 'Standard DHL Express'
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/catalog');

        return { success: true, message: 'Product created successfully' };
    } catch (error) {
        console.error('Create product error:', error);
        return { success: false, message: 'Database error: Failed to create product' };
    }
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });
    revalidatePath('/admin/products');
}
