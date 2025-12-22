import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backup() {
    console.log('Starting backup...');

    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    const orders = await prisma.order.findMany({ include: { items: true } });

    const data = {
        users,
        products,
        orders
    };

    const backupPath = path.join(process.cwd(), 'backup-data.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

    console.log(`Backup saved to ${backupPath}`);
    console.log(`Stats: ${users.length} users, ${products.length} products, ${orders.length} orders.`);
}

backup()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
