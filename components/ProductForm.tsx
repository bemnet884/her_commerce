"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ----------------------
// ✅ Validation Schema
// ----------------------
const productSchema = z.object({
  artist_id: z.number({ message: "Artist is required" }),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  images: z.string().array().optional(), // Array of URLs
  price: z.number({ message: "Price must be a number" }),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  status: z.enum(["pending", "approved", "sold"]).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

// ----------------------
// ✅ Component
// ----------------------
interface ProductFormProps {
  artists: { id: number; name: string }[]; // Pass list of artists
}

export default function ProductForm({ artists }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "pending", quantity: 0, images: [] },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      alert("🎉 Product created successfully!");
      reset();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto space-y-5 p-6 border rounded-2xl shadow-sm bg-white"
    >
      <h2 className="text-xl font-semibold text-gray-800">Create Product</h2>

      {/* Artist */}
      <div>
        <Label>Artist</Label>
        <Controller
          name="artist_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select an artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id.toString()}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.artist_id && <p className="text-red-500 text-sm">{errors.artist_id.message}</p>}
      </div>

      {/* Name */}
      <div>
        <Label>Product Name</Label>
        <Input placeholder="Ocean Waves" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea placeholder="Describe the product..." {...register("description")} />
      </div>

      {/* Images     <div>
        <Label>Images (URLs, comma-separated)</Label>
        <Input
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          {...register("images", {
            setValueAs: (v: string) =>
              v ? v.split(",").map((url) => url.trim()) : [],
          })}
        />
      </div> */}


      {/* Price */}
      <div>
        <Label>Price (USD)</Label>
        <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <Label>Quantity</Label>
        <Input type="number" {...register("quantity", { valueAsNumber: true })} />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
      </div>

      {/* Status */}
      <div>
        <Label>Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}
