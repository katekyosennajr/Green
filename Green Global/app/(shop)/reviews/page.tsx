import { Metadata } from 'next';
import { GeneralReviewList } from '@/components/reviews/general-review-list';
import { TestimonialsSection } from '@/components/testimonials-section';

export const metadata: Metadata = {
    title: 'Customer Reviews | Global Green Exporter',
    description: 'Read what collectors from around the world say about shipping rare plants from Borneo with Global Green.',
};

export default function ReviewsPage() {
    return (
        <div className="bg-white min-h-screen pt-12">
            {/* Header */}
            <div className="container mx-auto px-4 text-center mb-12">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-900 mb-4">Customer Stories</h1>
                <p className="text-green-600 max-w-2xl mx-auto text-lg">
                    We take pride in every plant we export. Here are stories from our community of collectors.
                </p>
            </div>

            {/* Reuse the Premium Testimonials Section */}
            <TestimonialsSection />

            <section className="container mx-auto px-4 py-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Recently Added</span>
                    <h2 className="font-serif text-3xl font-bold text-green-900 mt-2">Latest Community Reviews</h2>
                    <p className="text-green-600 mt-2">Real feedback from verified purchases.</p>
                </div>
                <GeneralReviewList />
            </section>

            {/* Additional CTA */}
            <div className="container mx-auto px-4 py-20 text-center border-t border-green-50">
                <h2 className="font-serif text-2xl font-bold text-green-900 mb-4">Ready to start your collection?</h2>
                <a href="/catalog" className="inline-block bg-green-900 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-colors">
                    Explore Our Catalog
                </a>
            </div>
        </div>
    );
}
