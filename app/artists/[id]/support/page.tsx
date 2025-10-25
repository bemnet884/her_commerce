// app/artists/[id]/support/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { artistProfiles, user } from "@/db/schema";
import { SupportForm } from "@/app/products/components/support-form";
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
      contactPhone: artistProfiles.contactPhone,
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

export default async function SupportArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const artistId = resolvedParams.id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const artist = await getArtist(artistId);

  // If user is not logged in, redirect to login
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to support {artist.name}
          </p>
          <div className="flex space-x-4 justify-center">
            <Button asChild>
              <Link href={`/login?redirect=/artists/${artistId}/support`}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <span className="text-gray-900 font-medium">Support</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-2xl">
              {artist.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support {artist.name}
          </h1>
          <p className="text-gray-600 mb-4">
            Help {artist.name} continue creating beautiful {artist.specialization?.toLowerCase()} artwork
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>{artist.specialization}</span>
            <span>•</span>
            <span>{artist.location}</span>
            {artist.experienceYears && (
              <>
                <span>•</span>
                <span>{artist.experienceYears} years experience</span>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* One-Time Support */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">One-Time Support</h2>
            <p className="text-gray-600 mb-6">
              Make a one-time donation to support {artist.name}'s work and help them purchase materials, tools, or cover living expenses.
            </p>

            <SupportForm
              artistId={artistId}
              type="one-time"
              presetAmounts={[500, 1000, 2000, 5000, 10000]}
              buttonText="Support with"
              description="Make a one-time donation"
            />
          </div>

          {/* Monthly Support */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Support</h2>
            <p className="text-gray-600 mb-6">
              Become a patron with recurring monthly support. Help provide stable income for {artist.name} to focus on their craft.
            </p>

            <SupportForm
              artistId={artistId}
              type="monthly"
              presetAmounts={[1000, 2000, 5000, 10000]}
              buttonText="Become a Monthly Patron"
              description="Recurring monthly support"
              showBenefits={true}
            />
          </div>
        </div>

        {/* Alternative Support Methods */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Ways to Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Purchase Products</h3>
              <p className="text-gray-600 text-sm mb-3">
                Buy {artist.name}'s handmade products directly
              </p>
              <Button asChild size="sm">
                <Link href={`/artists/${artistId}/products`}>
                  View Products
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Commission Work</h3>
              <p className="text-gray-600 text-sm mb-3">
                Request custom artwork or products
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href={`/contact/${artistId}?type=commission`}>
                  Request Commission
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share & Promote</h3>
              <p className="text-gray-600 text-sm mb-3">
                Help spread the word about their work
              </p>
              <div className="flex justify-center space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/artists/${artistId}`}>
                    Share Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Supporters Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Supporters</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Be the first to support {artist.name}!</p>
            <p className="text-sm text-gray-500">Your support will appear here to inspire others</p>
          </div>
        </div>
      </div>
    </div>
  );
}