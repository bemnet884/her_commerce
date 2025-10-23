// src/app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductInput } from "@/db/(queries)/product";

interface Product {
  id: number;
  name: string;
  artist_id: number;
  description?: string;
  price?: string;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (data: ProductInput) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <ProductForm onSubmit={handleCreate} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">All Products</h2>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="p-4 border rounded-md flex justify-between">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p>Artist ID: {product.artist_id}</p>
                <p>Price: {product.price}</p>
                <p>Status: {product.status}</p>
              </div>
              <div className="space-x-2">
                <button className="text-blue-500">Edit</button>
                <button
                  className="text-red-500"
                  onClick={async () => {
                    await fetch(`/api/products?id=${product.id}`, {
                      method: "DELETE",
                    });
                    fetchProducts();
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}