'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const scientificName = formData.get('scientificName') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;
    // Simplified image handling for demo (comma separated string -> json array)
    // In prod: Upload to S3/Cloudinary first
    const imagesValues = (formData.get('images') as string)?.split(',');
    const images = JSON.stringify(imagesValues);

    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000);

    await prisma.product.create({
        data: {
            name,
            scientificName,
            priceUsd: price,
            stock,
            description,
            images,
            slug,
            phytoIncluded: true,
            shippingInfo: 'Standard DHL Express'
        }
    });

    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });
    revalidatePath('/admin/products');
}
