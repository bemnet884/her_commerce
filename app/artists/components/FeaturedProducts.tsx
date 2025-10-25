import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category: { name: string };
}

interface FeaturedProductsProps {
  products: Product[];
  artistId: string;
}

export default function FeaturedProducts({ products, artistId }: FeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p className="text-gray-600">No products available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
        <Link href={`/artists/${artistId}/products`} className="text-purple-600 text-sm font-medium">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 hover:border-purple-300 transition-colors group"
          >
            <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h3 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-600">ETB {product.price}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
