// components/product-actions/EditProductButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditProductButtonProps {
  productId: string;
}

export function EditProductButton({ productId }: EditProductButtonProps) {
  return (
    <Button asChild size="sm">
      <Link href={`/products/${productId}/edit`}>
        Edit Product
      </Link>
    </Button>
  );
}