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
    const category = formData.get('category') as string;

    // File handling
    const imageFiles = formData.getAll('imageFiles') as File[];

    console.log('[CreateProduct] Received:', { name, priceRaw, stockRaw, files: imageFiles.length });

    if (!name || name.length < 3) {
        return { success: false, message: 'Name must be at least 3 characters', errors: { name: 'Name too short' } };
    }
    if (!priceRaw || isNaN(parseFloat(priceRaw))) {
        return { success: false, message: 'Invalid price', errors: { price: 'Enter a valid number' } };
    }

    const price = parseFloat(priceRaw);
    const stock = parseInt(stockRaw) || 0;

    // Process images
    const imageUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
        // Ensure upload dir exists (handled by mkdir previously, but good to be safe in logic if widely used, 
        // but for now relying on existing folder or filesystem limitations)
        // Since we are in Server Action, we can use fs
        const fs = await import('fs');
        const path = await import('path');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const file of imageFiles) {
            if (file.size > 0 && file.name !== 'undefined') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
                const filename = `${Date.now()}-${safeName}`;
                const filepath = path.join(uploadDir, filename);

                fs.writeFileSync(filepath, buffer);
                imageUrls.push(`/uploads/${filename}`);
            }
        }
    }

    // Fallback if no files uploaded but user provided URLs in a text field (backward compatibility or optional)
    // Checking if legacy 'images' field exists in case frontend wasn't fully updated or supports both
    const legacyImages = formData.get('images') as string;
    if (imageUrls.length === 0 && legacyImages) {
        const legacyUrls = legacyImages.split(',').map(s => s.trim()).filter(Boolean);
        imageUrls.push(...legacyUrls);
    }

    // Default placeholder if absolutely nothing
    if (imageUrls.length === 0) {
        imageUrls.push('/images/hero-bg.jpg'); // Use a valid existing image as placeholder
    }

    const images = JSON.stringify(imageUrls);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    try {
        await prisma.product.create({
            data: {
                name,
                scientificName,
                priceUsd: price,
                stock,
                description,
                category,
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
