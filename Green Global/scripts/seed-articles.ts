
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Articles...');

    // Get Admin User for author
    const admin = await prisma.user.findFirst();
    if (!admin) {
        console.log('No user found to assign as author. Skipping.');
        return;
    }

    const articles = [
        {
            title: "The Ultimate Guide to Acclimatizing Scindapsus",
            slug: "acclimatizing-scindapsus",
            excerpt: "Learn how to transition your imported Scindapsus from bare-root to pot without losing a leaf.",
            content: `
# Acclimatizing Your New Aroid

Importing plants can be stressful—for both you and the plant. Here is our step-by-step guide to ensuring your Scindapsus thrives after its journey from Borneo.

## 1. Unboxing
Gently remove the sphagnum moss. Do not pull the roots. Soak them in room temperature water with a drop of B1 solution.

## 2. Choosing the Medium
We recommend a mix of perlite, pine bark, and a little bit of coco peat. Scindapsus hate wet feet!

## 3. High Humidity
For the first 2 weeks, keep the plant in a humidity box or a greenhouse cabinet (80-90% humidity).
      `,
            coverImage: "https://images.unsplash.com/photo-1596720426673-e4a15a90d984?q=80&w=800&auto=format&fit=crop",
            authorId: admin.id
        },
        {
            title: "Why We Choose Premium Sphagnum Moss",
            slug: "premium-sphagnum-moss",
            excerpt: "Not all moss is created equal. Discvoer why we use Chilean Sphagnum for all our exports.",
            content: `
# The Moss Matters

Root rot is the enemy of any exporter. That's why we don't cut corners on packaging medium.

## Superior Retention
Chilean moss holds moisture while staying airy. This prevents anaerobic bacteria from forming during the 5-day DHL trip.

## Anti-bacterial Properties
Natural sphagnum has mild antiseptic qualities that protect fresh root cuts.
        `,
            coverImage: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=800&auto=format&fit=crop",
            authorId: admin.id
        },
        {
            title: "Understanding Phytosanitary Inspections",
            slug: "understanding-phyto",
            excerpt: "What happens at the quarantine office? A behind-the-scenes look at the export process.",
            content: `
# The Phyto Certificate

It's not just a piece of paper. It's a guarantee that your plant is free from pests and diseases.

## The Process
1. **Washing**: Roots are washed clean of soil.
2. **Inspection**: Lab tests for nematodes and mites.
3. **Sealing**: The box is sealed with official quarantine tape.

We handle this entire process for you, free of charge.
        `,
            coverImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop",
            authorId: admin.id
        }
    ];

    for (const article of articles) {
        const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
        if (!existing) {
            await prisma.article.create({ data: article });
            console.log(`Created: ${article.title}`);
        } else {
            console.log(`Skipped (Exists): ${article.title}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
