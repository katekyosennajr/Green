import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: {
                stock: {
                    gt: 0
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}
