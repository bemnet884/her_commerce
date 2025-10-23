// src/components/ProductForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductInput } from "@/db/(queries)/product";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Controller } from "react-hook-form";

// Create schema that matches ProductInput exactly
const productSchema = z.object({
  artist_id: z.number().min(1, "Artist ID is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.string().min(1, "Price is required"), // Keep as string to match ProductInput
  status: z.enum(["pending", "approved", "sold"]).default("pending"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductInput) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  // Handle price input separately to convert number to string
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("price", value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-md shadow-sm"
    >
      <div>
        <Label>Artist ID</Label>
        <Input
          type="number"
          {...register("artist_id", {
            valueAsNumber: true,
            setValueAs: (v) => v === "" ? undefined : parseInt(v, 10)
          })}
        />
        {errors.artist_id && (
          <p className="text-red-500 text-sm">{errors.artist_id.message}</p>
        )}
      </div>

      <div>
        <Label>Product Name</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label>Price</Label>
        <Input
          type="number"
          step="0.01"
          onChange={handlePriceChange}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <Label>Status</Label>
        <Controller
          name="status"
          control={control}
          defaultValue="pending"
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
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit">Save Product</Button>
    </form>
  );
};