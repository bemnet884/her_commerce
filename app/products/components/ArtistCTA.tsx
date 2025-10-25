import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ArtistCTA() {
  return (
    <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-8 text-center border">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Ready to Sell Your Creations?
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Join our community of talented artisans and start selling your handmade products worldwide.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products/new">Add Your First Product</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/artist/dashboard">Go to Artist Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
