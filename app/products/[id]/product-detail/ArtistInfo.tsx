"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArtistInfo({ artist }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">About the Artisan</h3>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-purple-600 font-semibold">
            {artist.name.split(' ').map((n: any[]) => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{artist.name}</h4>
            {artist.isVerified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {artist.specialization} • {artist.location}
          </p>
          {artist.experienceYears && (
            <p className="text-sm text-gray-600 mb-2">{artist.experienceYears} years of experience</p>
          )}
          {artist.bio && <p className="text-sm text-gray-600">{artist.bio}</p>}
          <div className="mt-3 flex space-x-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/artists/${artist.id}`}>View Profile</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/artists/${artist.id}/products`}>More Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
