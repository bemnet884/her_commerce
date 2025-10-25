import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArtistHeaderProps {
  artist: {
    name: string;
    specialization?: string;
    bio?: string;
    isVerified: boolean;
  };
  productsCount: number;
  artistId: string;
  isArtistOwner: boolean;
  isAdmin: boolean;
  session: any;
}

export default function ArtistHeader({
  artist,
  productsCount,
  artistId,
  isArtistOwner,
  isAdmin,
  session,
}: ArtistHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 flex flex-col lg:flex-row lg:justify-between">
      <div className="flex items-start space-x-6">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-purple-600 font-semibold text-2xl">
            {artist.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          {artist.isVerified && (
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Verified Artisan
            </span>
          )}
          {artist.specialization && <p className="text-purple-600 font-medium">{artist.specialization}</p>}
          {artist.bio && <p className="text-gray-600">{artist.bio}</p>}
        </div>
      </div>
      <div className="flex flex-col space-y-3 mt-6 lg:mt-0">
        {(isArtistOwner || isAdmin) && (
          <Button asChild>
            <Link href={`/artists/${artistId}/edit`}>Edit Profile</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href={`/artists/${artistId}/products`}>
            View All Products ({productsCount})
          </Link>
        </Button>
        {session && (
          <Button asChild variant="outline">
            <Link href={`/contact/${artistId}`}>Contact Artisan</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
