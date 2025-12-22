import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function restore() {
    console.log('Starting restore to Postgres...');

    const backupPath = path.join(process.cwd(), 'backup-data.json');
    if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file not found!');
    }

    const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    // 1. Clean existing data (optional, but safer for re-runs)
    // Order matters: delete child first (OrderItem -> Order -> User)
    console.log('Cleaning existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // 2. Restore Users
    console.log(`Restoring ${data.users.length} users...`);
    for (const user of data.users) {
        await prisma.user.create({ data: user });
    }

    // 3. Restore Products
    console.log(`Restoring ${data.products.length} products...`);
    for (const product of data.products) {
        // Check if handling BigInt/floats is needed? Usually JSON handles numbers fine unless huge.
        // However, Prisma schema might have default updated_at which conflicts if we pass it explicitly?
        // We'll pass it all.
        await prisma.product.create({ data: product });
    }

    // 4. Restore Orders
    console.log(`Restoring ${data.orders.length} orders...`);
    for (const order of data.orders) {
        const { items, ...orderData } = order;
        await prisma.order.create({
            data: {
                ...orderData,
                items: {
                    create: items.map((item: any) => {
                        const { id, orderId, ...itemData } = item;
                        // We don't need orderId as it's handled by relation
                        // We might want to keep the same ID for items or let them regenerate.
                        // If we keep IDs, we must ensure they are UUIDs.
                        return itemData;
                    })
                }
            }
        });
    }

    console.log('Restore completed successfully!');
}

restore()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
