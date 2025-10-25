interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export default function RatingSummary({ averageRating, totalReviews }: RatingSummaryProps) {
  if (totalReviews === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 text-center">
      <div className="text-3xl font-bold text-purple-600 mb-2">{averageRating.toFixed(1)}</div>
      <div className="flex items-center justify-center mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
