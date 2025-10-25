"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  product: any;
  isBuyer: boolean;
}

export default function ProductActions({ product, isBuyer }: ProductActionsProps) {
  if (!isBuyer) return null;

  if (!product.isActive)
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-800 font-medium">Product Unavailable</p>
      </div>
    );

  if (product.stockQuantity === 0)
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 font-medium">Out of Stock</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button size="lg" className="flex-1">Add to Cart</Button>
        <Button size="lg" variant="outline" className="flex-1">Buy Now</Button>
      </div>
      <div className="text-center">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/artists/${product.artist.id}`}>Contact Artisan</Link>
        </Button>
      </div>
    </div>
  );
}
