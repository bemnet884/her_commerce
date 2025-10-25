import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Navbar } from "./components/Navbar";
import { SearchFilter } from "./components/SearchFilter";
import { ProductGrid } from "./components/ProductGrid";
import { Pagination } from "./components/Pagination";
import { ArtistCTA } from "./components/ArtistCTA";
import { getProducts } from "./lib/getProducts";
import { getCategories } from "./lib/getCategories";
import { createSafeSearchParams } from "./lib/createSafeSearchParams";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolved = await searchParams;
  const safe = createSafeSearchParams(resolved);
  const session = await auth.api.getSession({ headers: await headers() });

  const [{ products, totalPages, currentPage }, categories] = await Promise.all([
    getProducts(safe),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Handmade Products</h1>
          <p className="text-gray-600">Discover unique creations from talented artisans</p>
        </header>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <SearchFilter categories={categories} defaultValues={safe} />
        </div>
        {/*     */}


        <ProductGrid products={products} />
        <Pagination totalPages={totalPages} currentPage={currentPage} safeSearchParams={safe} />

        {session && <ArtistCTA />}
      </main>
    </div>
  );
}
