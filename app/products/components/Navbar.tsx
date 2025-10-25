import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar({ session }: { session: any }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              SheConnect+
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/products" className="text-purple-600 font-medium">
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
  );
}
