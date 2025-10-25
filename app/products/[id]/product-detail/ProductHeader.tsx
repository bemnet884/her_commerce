"use client";

export default function ProductHeader({ product, averageRating, reviews }: any) {
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

      <div className="flex items-center space-x-4 mb-3">
        <span className="text-2xl font-bold text-purple-600">ETB {product.price}</span>
        {product.originalPrice && (
          <span className="text-lg text-gray-500 line-through">
            ETB {product.originalPrice}
          </span>
        )}
        {product.stockQuantity <= 5 && (
          <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      )}
    </div>
  );
}
