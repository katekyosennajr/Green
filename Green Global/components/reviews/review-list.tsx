import { StarRating } from './star-rating';
import { getProductReviews } from '@/app/actions/review-actions';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
    productId: string;
}

export async function ReviewList({ productId }: ReviewListProps) {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-green-50/30 rounded-xl border border-dashed border-green-200">
                <p className="text-green-600 text-sm">No reviews yet. Be the first to review this plant!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-green-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                                {review.user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-900">{review.user.name || 'Anonymous'}</p>
                                <p className="text-xs text-green-400">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                    </div>
                    {review.comment && (
                        <p className="text-sm text-green-700 leading-relaxed mt-2 pl-11">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
