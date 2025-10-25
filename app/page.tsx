import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { roles, userRoles, artistProfiles, agentProfiles } from "@/db/schema";
import Hero from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import AboutPage from "@/components/About";

async function getUserRoles(userId: string) {
  const userRolesData = await db
    .select({
      roleName: roles.name,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return userRolesData.map(ur => ur.roleName);
}

async function getUserProfileData(userId: string) {
  const [artistProfile, agentProfile] = await Promise.all([
    db.query.artistProfiles.findFirst({
      where: eq(artistProfiles.userId, userId),
    }),
    db.query.agentProfiles.findFirst({
      where: eq(agentProfiles.userId, userId),
    }),
  ]);

  return { artistProfile, agentProfile };
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="shrink-0">
                  <h1 className="text-2xl font-bold text-purple-600">SheConnect+</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>


      </div>
    );
  }

  // Get user roles and profile data for logged-in users
  const [userRolesList, profileData] = await Promise.all([
    getUserRoles(session.user.id),
    getUserProfileData(session.user.id),
  ]);

  const isArtist = userRolesList.includes('artist');
  const isAgent = userRolesList.includes('agent');
  const isAdmin = userRolesList.includes('admin');
  const isBuyer = userRolesList.includes('buyer');

  // Check if profiles need completion
  const needsArtistOnboarding = isArtist && !profileData.artistProfile?.location;
  const needsAgentOnboarding = isAgent && !profileData.agentProfile?.region;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onboarding Alerts */}
        {needsArtistOnboarding && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-800">Complete Your Artist Profile</h3>
                <p className="text-blue-600">Add your location, specialization, and bio to start selling.</p>
              </div>
              <Button asChild>
                <Link href="/onboarding/artist">Complete Profile</Link>
              </Button>
            </div>
          </div>
        )}

        {needsAgentOnboarding && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-orange-800">Complete Your Agent Profile</h3>
                <p className="text-orange-600">Add your region and contact information to start helping artisans.</p>
              </div>
              <Button asChild>
                <Link href="/onboarding/agent">Complete Profile</Link>
              </Button>
            </div>
          </div>
        )}


        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-gray-600">
                {isArtist && "Ready to showcase your latest creations?"}
                {isAgent && "Help connect artisans with customers worldwide."}
                {isAdmin && "Manage and grow the SheConnect+ platform."}
                {isBuyer && !isArtist && !isAgent && "Discover unique handmade products from talented artisans."}
              </p>
            </div>

            {/* Role Management */}
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline">
                <Link href="/profile/roles">
                  Manage Roles
                </Link>
              </Button>
            </div>
          </div>

          {/* Role Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {userRolesList.map((role) => (
              <span
                key={role}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full capitalize"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Quick Actions based on role */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Common Actions for all users */}
            <Link href="/products" className="block group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 border border-gray-200 transition-all duration-200 group-hover:shadow-md">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Products</h3>
                <p className="text-sm text-gray-600">Discover handmade creations from artisans</p>
              </div>
            </Link>

            {/* Artist-specific actions */}
            {isArtist && (
              <>
                <Link href="/artist/dashboard" className="block group">
                  <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 border border-purple-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Artist Dashboard</h3>
                    <p className="text-sm text-gray-600">Manage your products and orders</p>
                  </div>
                </Link>
                <Link href="/products/new" className="block group">
                  <div className="bg-green-50 hover:bg-green-100 rounded-lg p-6 border border-green-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Add New Product</h3>
                    <p className="text-sm text-gray-600">List your handmade items for sale</p>
                  </div>
                </Link>
              </>
            )}

            {/* Agent-specific actions */}
            {isAgent && (
              <>
                <Link href="/agent/dashboard" className="block group">
                  <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 border border-blue-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Agent Dashboard</h3>
                    <p className="text-sm text-gray-600">Manage artisans and track sales</p>
                  </div>
                </Link>
                <Link href="/agent/artists" className="block group">
                  <div className="bg-orange-50 hover:bg-orange-100 rounded-lg p-6 border border-orange-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">My Artisans</h3>
                    <p className="text-sm text-gray-600">View and manage assigned artisans</p>
                  </div>
                </Link>
              </>
            )}

            {/* Admin-specific actions */}
            {isAdmin && (
              <>
                <Link href="/admin/dashboard" className="block group">
                  <div className="bg-red-50 hover:bg-red-100 rounded-lg p-6 border border-red-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Admin Panel</h3>
                    <p className="text-sm text-gray-600">Manage users and platform settings</p>
                  </div>
                </Link>
                <Link href="/admin/verifications" className="block group">
                  <div className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 border border-yellow-200 transition-all duration-200 group-hover:shadow-md">
                    <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Verify Agents</h3>
                    <p className="text-sm text-gray-600">Review agent applications</p>
                  </div>
                </Link>
              </>
            )}

            {/* Buyer-specific actions */}
            {isBuyer && (
              <Link href="/my-orders" className="block group">
                <div className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-6 border border-indigo-200 transition-all duration-200 group-hover:shadow-md">
                  <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">My Orders</h3>
                  <p className="text-sm text-gray-600">Track your purchases and orders</p>
                </div>
              </Link>
            )}

            {/* Role Management Card */}
            <Link href="/profile/roles" className="block group">
              <div className="bg-linear-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg p-6 border border-purple-200 transition-all duration-200 group-hover:shadow-md">
                <div className="w-10 h-10 bg-linear-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Manage Roles</h3>
                <p className="text-sm text-gray-600">Add or change your roles on the platform</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats and Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Platform Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Artisans</span>
                <span className="font-semibold">500+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Products Listed</span>
                <span className="font-semibold">2,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries Reached</span>
                <span className="font-semibold">50+</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/help" className="flex items-center text-sm text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help Center
              </Link>
              <Link href="/contact" className="flex items-center text-sm text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
              <Link href="/profile" className="flex items-center text-sm text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Support Artisans</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your purchases directly support women entrepreneurs and help preserve traditional crafts.
            </p>
            <Button asChild size="sm" className="w-full">
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}