// app/products/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const product = await response.json();
        router.push(`/products/${product.id}`);
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real app, you would upload to cloud storage
    // For now, we'll create object URLs for preview
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="mt-2 text-gray-600">
                Share your handmade creation with the world
              </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g., Handwoven Cotton Scarf"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Describe your product, materials used, techniques, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (ETB) *
                    </label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                      Stock Quantity *
                    </label>
                    <Input
                      type="number"
                      id="stockQuantity"
                      name="stockQuantity"
                      min="1"
                      required
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>

                <select
                  id="category"
                  name="categoryId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="weaving">Handwoven Textiles</option>
                  <option value="pottery">Pottery & Ceramics</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="basketry">Basketry</option>
                  <option value="leather">Leather Crafts</option>
                  <option value="wood">Wood Carvings</option>
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Images *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>

                <div>
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
                    Materials Used
                  </label>
                  <Input
                    type="text"
                    id="materials"
                    name="materials"
                    placeholder="e.g., Cotton, Wool, Silver"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate materials with commas</p>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <Input
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="e.g., traditional, handmade, eco-friendly"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                      Length (cm)
                    </label>
                    <Input type="number" id="length" name="length" min="0" />
                  </div>
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                      Width (cm)
                    </label>
                    <Input type="number" id="width" name="width" min="0" />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Height (cm)
                    </label>
                    <Input type="number" id="height" name="height" min="0" />
                  </div>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    id="weight"
                    name="weight"
                    min="0"
                    step="0.001"
                    placeholder="0.000"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Product..." : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}