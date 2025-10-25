// app/onboarding/artist/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArtistOnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    // Here you would update the artist profile with additional information
    // For now, just redirect to dashboard
    router.push("/artist/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Artist Profile
              </h1>
              <p className="mt-2 text-gray-600">
                Tell us more about your craft and skills
              </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="">Select your craft</option>
                  <option value="Weaving">Weaving</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Jewelry Making">Jewelry Making</option>
                  <option value="Basketry">Basketry</option>
                  <option value="Leather Work">Leather Work</option>
                  <option value="Wood Carving">Wood Carving</option>
                  <option value="Textile Art">Textile Art</option>
                  <option value="Metal Work">Metal Work</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  id="experience"
                  name="experienceYears"
                  min="0"
                  max="50"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City, Region"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="contactPhone"
                  placeholder="+251 ..."
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell us about your craft, inspiration, and techniques..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Skip for now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Complete Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}