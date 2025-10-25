interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  product: { name: string };
  buyer: { name: string };
}

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium text-gray-900">{review.buyer.name}</span>
            </div>
            {review.comment && <p className="text-gray-600 mb-2">{review.comment}</p>}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Product: {review.product.name}</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
