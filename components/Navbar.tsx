"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  user?: {
    name: string;
    roles: string[];
  };
  isArtist: boolean;
  isAgent: boolean;
  isAdmin: boolean;
  signOutAction: () => void;
}

export function Navbar({ user, isArtist, isAgent, isAdmin, signOutAction }: NavbarProps) {
  // Safe defaults for user data
  const safeUser = user || { name: "Guest", roles: [] };
  const userRolesList = safeUser.roles || [];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-[#3695AB] backdrop-blur-sm bg-white/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-[#3695AB]">SheConnect+</h1>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#3695AB] transition-colors duration-200 font-medium"
              >
                Products
              </Link>
              <Link
                href="/artists"
                className="text-gray-700 hover:text-[#3695AB] transition-colors duration-200 font-medium"
              >
                Artisans
              </Link>
              {isArtist && (
                <Link
                  href="/artist/dashboard"
                  className="text-gray-700 hover:text-[#3695AB] transition-colors duration-200 font-medium"
                >
                  My Dashboard
                </Link>
              )}
              {isAgent && (
                <Link
                  href="/agent/dashboard"
                  className="text-gray-700 hover:text-[#3695AB] transition-colors duration-200 font-medium"
                >
                  Agent Portal
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-[#3695AB] transition-colors duration-200 font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Info and Sign Out - Only show if user exists */}
          {safeUser.name !== "Guest" ? (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{safeUser.name}</p>
                <div className="flex space-x-1">
                  {userRolesList.map((role, index) => (
                    <span
                      key={role}
                      className="text-xs text-gray-500 capitalize"
                    >
                      {role}
                      {index < userRolesList.length - 1 && ","}
                    </span>
                  ))}
                </div>
              </div>
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="border-[#3695AB] text-[#3695AB] hover:bg-[#3695AB] hover:text-white transition-colors duration-200"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-[#3695AB] hover:text-[#0F545C] transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#3695AB] text-white rounded-full hover:bg-[#0F545C] transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}