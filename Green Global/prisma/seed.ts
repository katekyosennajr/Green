import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const scindapsus = await prisma.product.upsert({
        where: { slug: 'scindapsus-borneo-tricolor' },
        update: {},
        create: {
            name: 'Best Selected - Scindapsus Borneo Tricolor',
            scientificName: 'Scindapsus pictus var. borneo',
            slug: 'scindapsus-borneo-tricolor',
            description: 'A stunning rare aroid from the deep jungles of Borneo. Features iridescent tricolor leaves with splashing silver, dark green, and light mint patterns. Highly sought after by collectors.',
            priceUsd: 149.00,
            priceIdr: 2200000,
            stock: 5,
            isFeatured: true,
            images: '["/images/products/scindapsus-borneo-1.jpg", "/images/products/scindapsus-borneo-2.jpg"]',
            shippingInfo: 'Shipped bare root with moist sphagnum moss wrapped in plastic. Phyto certificate processing takes 3-5 days.',
            phytoIncluded: true,
        },
    })

    console.log({ scindapsus })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
