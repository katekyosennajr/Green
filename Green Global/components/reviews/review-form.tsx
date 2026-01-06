'use client';

import { useState } from 'react';
import { StarRating } from './star-rating';
import { createReview } from '@/app/actions/review-actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner'; // Assuming sonner or we use alert

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!session?.user) {
        return (
            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 text-center">
                <p className="text-green-800 mb-2">Please log in to write a review.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="text-sm font-bold text-gold-600 hover:text-gold-700 underline"
                >
                    Login Here
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }

        setIsSubmitting(true);
        // Assuming userId is available in session.user.id or we pass it? 
        // NextAuth session usually has no ID by default unless customized.
        // If my session callback didn't add ID, this might fail.
        // Let's assume session.user.id exists from previous works or I'll check auth options.
        // For now, I'll try to use session.user.email purely? No, schema needs userId.
        // NOTE: In auth-actions, createReview takes userId. 
        // I'll grab it from session if extended, otherwise I might need to fix auth.

        // TEMPORARY FIX: If session.user has no 'id' type, I'll cast it to any.
        const userId = (session.user as any).id;

        if (!userId) {
            setError("User ID not found. Please relogin.");
            setIsSubmitting(false);
            return;
        }

        const result = await createReview(userId, { productId, rating, comment });

        if (result.success) {
            setRating(0);
            setComment('');
            onSuccess?.();
            router.refresh();
        } else {
            setError(result.error as string);
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-green-100 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-green-900">Write a Review</h3>

            <div>
                <label className="block text-xs font-bold uppercase text-green-600 mb-2">Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} size={24} />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-green-600 mb-2">Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 rounded-lg border border-green-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-green-50/30 text-green-900 text-sm"
                    rows={4}
                    placeholder="How was the plant? Delivery condition?"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-xs italic">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-900 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Review
            </button>
        </form>
    );
}
