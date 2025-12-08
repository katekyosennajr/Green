"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scindapsus = yield prisma.product.upsert({
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
        });
        console.log({ scindapsus });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
    // Seed Admin User
    const adminEmail = 'admin@globalgreen.com';
    const existingAdmin = yield prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        yield prisma.user.create({
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
}));
