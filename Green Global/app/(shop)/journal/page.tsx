import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function getArticles() {
    return await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
    }); // Add error handling in real app
}

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
    const articles = await getArticles();

    return (
        <div className="bg-cream-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-green-900 text-cream-50 pt-32 pb-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <span className="text-gold-500 font-bold tracking-widest uppercase text-xs mb-4 block">The Green Global Journal</span>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">Cultivating Knowledge</h1>
                    <p className="text-green-100 text-lg">
                        Expert guides on Aroid care, insights into our nursery operations, and the latest botanical trends from Borneo.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 -mt-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link
                            href={`/journal/${article.slug}`}
                            key={article.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-green-50 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center text-xs text-green-500 mb-4 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {format(new Date(article.createdAt), 'MMM d, yyyy')}
                                    </div>
                                    {article.author?.name && (
                                        <div className="flex items-center">
                                            <User className="w-3 h-3 mr-1" />
                                            {article.author.name}
                                        </div>
                                    )}
                                </div>

                                <h2 className="font-serif text-2xl font-bold text-green-900 mb-3 group-hover:text-gold-600 transition-colors leading-tight">
                                    {article.title}
                                </h2>

                                <p className="text-green-700 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-gold-600 font-bold text-sm uppercase tracking-wider group-hover:underline">
                                    Read Article
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {articles.length === 0 && (
                <div className="container mx-auto text-center py-20 text-green-500 italic">
                    No articles published yet. Check back soon.
                </div>
            )}
        </div>
    );
}
