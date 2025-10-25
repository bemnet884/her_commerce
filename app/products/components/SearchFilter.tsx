"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SearchFilter({ categories, defaultValues }: any) {
  const [search, setSearch] = useState(defaultValues.search || "");
  const [category, setCategory] = useState(defaultValues.category || "");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced real-time search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() || category) {
        fetchProducts(search, category);
      } else {
        setProducts([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  async function fetchProducts(searchQuery: string, categoryName: string) {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchQuery,
        category: categoryName,
        page: "1",
      }).toString();

      const res = await fetch(`/api/products?${query}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const text = await res.text();
      const data = text ? JSON.parse(text) : { data: [] };
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            name="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <Button type="button" variant="outline" asChild>
          <Link href="/products">Clear</Link>
        </Button>
      </div>

    </div>
  );
}
