import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SupportArtistProps {
  artistName: string;
  specialization?: string;
  artistId: string;
}

export default function SupportArtist({ artistName, specialization, artistId }: SupportArtistProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Support {artistName}'s Work
          </h3>
          {specialization && (
            <p className="text-gray-600">
              Help this talented artisan continue creating beautiful {specialization.toLowerCase()} artwork
            </p>
          )}
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button asChild>
            <Link href={`/artists/${artistId}/support`}>
              Support Artist
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/artists/${artistId}/products`}>
              Buy Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
