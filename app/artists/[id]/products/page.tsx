// app/artists/[id]/products/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eq, desc, like, and, count, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import { artistProfiles, user, products, productCategories } from "@/db/schema";

async function getArtist(id: string) {
  const artist = await db
    .select({
      id: artistProfiles.id,
      userId: artistProfiles.userId,
      name: user.name,
      bio: artistProfiles.bio,
      specialization: artistProfiles.specialization,
      experienceYears: artistProfiles.experienceYears,
      location: artistProfiles.location,
      isVerified: artistProfiles.isVerified,
    })
    .from(artistProfiles)
    .innerJoin(user, eq(artistProfiles.userId, user.id))
    .where(eq(artistProfiles.id, id))
    .then(res => res[0]);

  if (!artist) {
    notFound();
  }

  return artist;
}

async function getArtistProducts(
  artistId: string,
  searchParams: { [key: string]: string | string[] | undefined }
) {
  const search = searchParams.search as string;
  const category = searchParams.category as string;
  const sort = searchParams.sort as string || 'newest';
  const page = parseInt(searchParams.page as string) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  let whereConditions = [
    eq(products.artistId, artistId),
    eq(products.isActive, true)
  ];

  if (search) {
    whereConditions.push(
      like(products.name, `%${search}%`)
    );
  }

  if (category) {
    const categoryRecord = await db.query.productCategories.findFirst({
      where: eq(productCategories.name, category),
    });

    if (categoryRecord) {
      whereConditions.push(eq(products.categoryId, categoryRecord.id));
    }
  }

  // Determine sort order
  let orderBy;
  switch (sort) {
    case 'price-low':
      orderBy = products.price;
      break;
    case 'price-high':
      orderBy = desc(products.price);
      break;
    case 'name':
      orderBy = products.name;
      break;
    case 'oldest':
      orderBy = products.createdAt;
      break;
    default: // 'newest'
      orderBy = desc(products.createdAt);
  }

  const productsData = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      originalPrice: products.originalPrice,
      images: products.images,
      stockQuantity: products.stockQuantity,
      materials: products.materials,
      tags: products.tags,
      createdAt: products.createdAt,
      category: {
        id: productCategories.id,
        name: productCategories.name,
      },
    })
    .from(products)
    .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: products.id })
    .from(products)
    .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(and(...whereConditions))
    .then(res => res.length);

  const totalCount = totalCountResult;
  const totalPages = Math.ceil(totalCount / limit);

  return { products: productsData, totalPages, currentPage: page, totalCount };
}

async function getCategories() {
  return await db.select().from(productCategories);
}

// Create a safe search params object
function createSafeSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  const safeParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      safeParams[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      safeParams[key] = value[0];
    }
  }

  return safeParams;
}

export default async function ArtistProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const safeSearchParams = createSafeSearchParams(resolvedSearchParams);

  const artistId = resolvedParams.id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [artist, { products: artistProducts, totalPages, currentPage, totalCount }, categories] = await Promise.all([
    getArtist(artistId),
    getArtistProducts(artistId, safeSearchParams),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                SheConnect+
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/products" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Products
                </Link>
                <Link href="/artists" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Artisans
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/artists" className="text-gray-500 hover:text-gray-700">
                Artisans
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href={`/artists/${artistId}`} className="text-gray-500 hover:text-gray-700">
                {artist.name}
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Products</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artist.name}'s Products
              </h1>
              <p className="text-gray-600 mb-4">
                Discover all handmade creations by {artist.name}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {totalCount} product{totalCount !== 1 ? 's' : ''}
                </span>
                <span>{artist.specialization}</span>
                <span>{artist.location}</span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <Button asChild variant="outline">
                <Link href={`/artists/${artistId}`}>
                  Back to Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={safeSearchParams.search || ''}
                className="w-full"
              />
            </div>
            <select
              name="category"
              defaultValue={safeSearchParams.category || ''}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={safeSearchParams.sort || 'newest'}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">Apply</Button>
              <Button type="reset" variant="outline" asChild>
                <Link href={`/artists/${artistId}/products`}>Clear</Link>
              </Button>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        {artistProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {safeSearchParams.search || safeSearchParams.category || safeSearchParams.sort !== 'newest'
                ? "Try adjusting your search criteria"
                : `${artist.name} hasn't added any products yet`}
            </p>
            <Button asChild>
              <Link href={`/artists/${artistId}/products`}>
                View All Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {artistProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">
                          ETB {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ETB {product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.stockQuantity <= 5 && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                      <span>
                        {product.stockQuantity} in stock
                      </span>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  asChild
                  variant="outline"
                  disabled={currentPage === 1}
                >
                  <Link
                    href={{
                      pathname: `/artists/${artistId}/products`,
                      query: { ...safeSearchParams, page: currentPage - 1 },
                    }}
                  >
                    Previous
                  </Link>
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    asChild
                    variant={currentPage === page ? "default" : "outline"}
                  >
                    <Link
                      href={{
                        pathname: `/artists/${artistId}/products`,
                        query: { ...safeSearchParams, page },
                      }}
                    >
                      {page}
                    </Link>
                  </Button>
                ))}

                <Button
                  asChild
                  variant="outline"
                  disabled={currentPage === totalPages}
                >
                  <Link
                    href={{
                      pathname: `/artists/${artistId}/products`,
                      query: { ...safeSearchParams, page: currentPage + 1 },
                    }}
                  >
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {session && (
          <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-8 text-center border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Interested in {artist.name}'s Work?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact {artist.name} directly for custom orders or wholesale inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={`/contact/${artistId}`}>
                  Contact Artisan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/artists/${artistId}`}>
                  View Artist Profile
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}