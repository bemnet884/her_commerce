"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditProductButton } from "@/components/product-actions/EditProductButton";
import { DeleteProductButton } from "@/components/product-actions/DeleteProductButton";

interface ProductManagementProps {
  product: any;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isAgentForThisArtist: boolean;
}

export default function ProductManagement({
  product,
  canEditProduct,
  canDeleteProduct,
  isAdmin,
  isAgent,
  isAgentForThisArtist,
}: ProductManagementProps) {
  if (!canEditProduct && !canDeleteProduct) return null;

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
        <div className="flex space-x-3">
          {canEditProduct && <EditProductButton productId={product.id} />}
          {canDeleteProduct && <DeleteProductButton productId={product.id} productName={product.name} />}
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/products/${product.id}/analytics`}>View Analytics</Link>
            </Button>
          )}
          {isAgent && isAgentForThisArtist && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/agent/products/${product.id}/performance`}>Sales Performance</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
