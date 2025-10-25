"use client";

export default function ProductReviews({ reviews }: any) {
  if (!reviews.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review: any) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
                  </svg>
                ))}
              </div>
              <span className="font-medium text-gray-900">{review.buyer.name}</span>
              {review.isVerifiedPurchase && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
            {review.comment && <p className="text-gray-600">{review.comment}</p>}
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
