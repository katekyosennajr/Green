
import { getAllReviews } from '@/app/actions/review-actions';
import { StarRating } from './star-rating';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export async function GeneralReviewList() {
    const reviews = await getAllReviews();

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-green-50/30 rounded-xl border border-dashed border-green-200">
                <p className="text-green-600">No community reviews yet. Be the first to order and share your experience!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-green-50 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                                {review.user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-green-900 text-sm">{review.user.name || 'Plant Lover'}</p>
                                <p className="text-xs text-green-500">
                                    {[review.user.city, review.user.country].filter(Boolean).join(', ') || 'Verified Buyer'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-green-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                    </div>

                    <div className="mb-4">
                        <StarRating rating={review.rating} size={16} />
                    </div>

                    <div className="flex-grow">
                        {review.comment ? (
                            <p className="text-green-800 text-sm leading-relaxed italic">"{review.comment}"</p>
                        ) : (
                            <p className="text-green-400 text-xs italic">No written comment</p>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-green-50">
                        <Link href={`/product/${review.product.slug}`} className="flex items-center gap-3 group">
                            {review.product.images ? (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={JSON.parse(review.product.images)[0]}
                                        alt={review.product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>
                            ) : null}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-green-500 font-medium truncate">Purchased product:</p>
                                <p className="text-xs font-bold text-green-900 truncate group-hover:text-gold-600 transition-colors">
                                    {review.product.name}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
