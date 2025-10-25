// app/artists/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eq, desc, like, and, count, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import { artistProfiles, user, products, userRoles, roles } from "@/db/schema";

async function getArtists(searchParams: { [key: string]: string | string[] | undefined }) {
  const search = searchParams.search as string;
  const specialization = searchParams.specialization as string;
  const location = searchParams.location as string;
  const page = parseInt(searchParams.page as string) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  let whereConditions = [eq(artistProfiles.isVerified, true)];

  if (search) {
    whereConditions.push(
      like(user.name, `%${search}%`)
    );
  }

  if (specialization) {
    whereConditions.push(
      like(artistProfiles.specialization, `%${specialization}%`)
    );
  }

  if (location) {
    whereConditions.push(
      like(artistProfiles.location, `%${location}%`)
    );
  }

  // Get artists with product counts
  const artistsData = await db
    .select({
      id: artistProfiles.id,
      name: user.name,
      bio: artistProfiles.bio,
      specialization: artistProfiles.specialization,
      experienceYears: artistProfiles.experienceYears,
      location: artistProfiles.location,
      isVerified: artistProfiles.isVerified,
      createdAt: artistProfiles.createdAt,
      productCount: count(products.id),
    })
    .from(artistProfiles)
    .innerJoin(user, eq(artistProfiles.userId, user.id))
    .leftJoin(products, and(
      eq(products.artistId, artistProfiles.id),
      eq(products.isActive, true)
    ))
    .where(and(...whereConditions))
    .groupBy(artistProfiles.id, user.id)
    .orderBy(desc(artistProfiles.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: sql<number>`count(distinct ${artistProfiles.id})` })
    .from(artistProfiles)
    .innerJoin(user, eq(artistProfiles.userId, user.id))
    .where(and(...whereConditions));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { artists: artistsData, totalPages, currentPage: page };
}

async function getSpecializations() {
  const specializations = await db
    .selectDistinct({ specialization: artistProfiles.specialization })
    .from(artistProfiles)
    .where(sql`${artistProfiles.specialization} is not null`)
    .then(res => res.map(r => r.specialization).filter(Boolean));

  return specializations as string[];
}

async function getLocations() {
  const locations = await db
    .selectDistinct({ location: artistProfiles.location })
    .from(artistProfiles)
    .where(sql`${artistProfiles.location} is not null`)
    .then(res => res.map(r => r.location).filter(Boolean));

  return locations as string[];
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

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const safeSearchParams = createSafeSearchParams(resolvedSearchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [{ artists, totalPages, currentPage }, specializations, locations] = await Promise.all([
    getArtists(safeSearchParams),
    getSpecializations(),
    getLocations(),
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
                <Link href="/artists" className="text-purple-600 font-medium">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet Our Artisans</h1>
          <p className="text-gray-600">
            Discover talented artisans and their unique handmade creations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                name="search"
                placeholder="Search by name..."
                defaultValue={safeSearchParams.search || ''}
                className="w-full"
              />
            </div>
            <select
              name="specialization"
              defaultValue={safeSearchParams.specialization || ''}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <select
              name="location"
              defaultValue={safeSearchParams.location || ''}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">Search</Button>
              <Button type="reset" variant="outline" asChild>
                <Link href="/artists">Clear</Link>
              </Button>
            </div>
          </form>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button asChild>
              <Link href="/artists">View All Artisans</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold text-lg">
                          {artist.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                          {artist.specialization}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {artist.location}
                        </p>
                      </div>
                    </div>

                    {artist.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {artist.bio}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {artist.experienceYears && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {artist.experienceYears} years
                          </span>
                        )}
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          {artist.productCount} products
                        </span>
                      </div>
                      {artist.isVerified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
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
                      pathname: "/artists",
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
                        pathname: "/artists",
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
                      pathname: "/artists",
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

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {artists.length}+
              </div>
              <div className="text-gray-600">Verified Artisans</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {specializations.length}+
              </div>
              <div className="text-gray-600">Craft Specializations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {locations.length}+
              </div>
              <div className="text-gray-600">Locations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}