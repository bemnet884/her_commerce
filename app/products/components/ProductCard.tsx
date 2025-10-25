import Link from "next/link";

export function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
    >
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {product.images?.length ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-purple-600">ETB {product.price}</span>
          {product.stockQuantity <= 5 && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Low Stock</span>
          )}
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{product.artist.name}</span>
          <span>{product.category.name}</span>
        </div>
      </div>
    </Link>
  );
}
