import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { Metadata } from 'next';

const prisma = new PrismaClient();

async function getArticle(slug: string) {
    return await prisma.article.findUnique({
        where: { slug },
        include: { author: { select: { name: true } } }
    });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const article = await getArticle(resolvedParams.slug);

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | Green Global Journal`,
        description: article.excerpt,
        openGraph: {
            images: [article.coverImage],
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = await getArticle(resolvedParams.slug);

    if (!article) notFound();

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 z-10">
                    <Link href="/journal" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Journal
                    </Link>

                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-green-100 space-x-6 text-sm md:text-base font-medium">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            {format(new Date(article.createdAt), 'MMMM d, yyyy')}
                        </div>
                        {article.author?.name && (
                            <div className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                {article.author.name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <main className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl border border-green-50 max-w-4xl mx-auto">

                    {/* Share Button (Visual Only) */}
                    <div className="flex justify-end mb-8">
                        <button className="flex items-center text-green-600 hover:text-gold-600 transition-colors text-sm font-bold uppercase tracking-widest">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </button>
                    </div>

                    {/* Prosed Content - Simple Markdown Simulation */}
                    <article className="prose prose-green prose-lg max-w-none font-serif">
                        <div className="whitespace-pre-wrap leading-loose text-green-900">
                            {/* Basic cleanup for the seed data which has raw markdown symbols */}
                            {article.content}
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="mt-16 pt-12 border-t border-green-100 text-center">
                        <p className="text-green-600 mb-6 italic">Did you find this helper? Explore our rare collection.</p>
                        <Link href="/catalog" className="inline-block bg-green-900 text-white px-10 py-4 rounded-full font-bold hover:bg-green-800 transition-all hover:scale-105 shadow-lg">
                            Shop Scindapsus
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}
