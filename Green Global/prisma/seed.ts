import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const products = [
        {
            name: 'Best Selected - Scindapsus Borneo Tricolor',
            scientificName: 'Scindapsus pictus var. borneo',
            slug: 'scindapsus-borneo-tricolor',
            description: 'A stunning rare aroid from the deep jungles of Borneo. Features iridescent tricolor leaves with splashing silver, dark green, and light mint patterns. Highly sought after by collectors.',
            priceUsd: 149.00,
            priceIdr: 2200000,
            stock: 5,
            isFeatured: true,
            images: '["/images/products/scindapsus-borneo-tricolor.jpg", "/images/products/scindapsus-borneo-2.jpg"]',
            shippingInfo: 'Shipped bare root with moist sphagnum moss wrapped in plastic. Phyto certificate processing takes 3-5 days.',
            phytoIncluded: true,
            category: 'Scindapsus'
        },
        {
            name: 'Monstera Adansonii Variegated (Archipelago)',
            scientificName: 'Monstera adansonii variegata',
            slug: 'monstera-adansonii-variegated',
            description: 'The "Archipelago" variegation is a stable and highly contrasted form of Monstera Adansonii. Features distinct white/yellow sectoral variegation on perforated leaves.',
            priceUsd: 450.00,
            priceIdr: 7200000,
            stock: 3,
            isFeatured: true,
            images: '["/images/products/monstera-adansonii.png"]',
            shippingInfo: 'Shipped in sphagnum moss. Free Phyto.',
            phytoIncluded: true,
            category: 'Monstera'
        },
        {
            name: 'Monstera Deliciosa Albo Variegata',
            scientificName: 'Monstera deliciosa var. borsigiana albo',
            slug: 'monstera-albo',
            description: 'The classic highly variegated Monstera Albo. Each leaf is unique with splashes of pure white and deep green. A must-have for any serious collector.',
            priceUsd: 199.00,
            priceIdr: 3200000,
            stock: 8,
            isFeatured: true,
            images: '["/images/products/monstera-albo.png"]',
            shippingInfo: 'Shipped bare root. Phyto certificate included.',
            phytoIncluded: true,
            category: 'Monstera'
        }
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                ...p
            },
            create: {
                ...p
            }
        });
    }

    // Seed Admin User
    const adminEmail = 'admin@globalgreen.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Admin User',
                password: 'admin123', // In real app, hash this!
                role: 'ADMIN'
            }
        });
        console.log('Admin user created');
    }

    console.log('Seeding finished.');
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

