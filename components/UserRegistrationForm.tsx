"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Controller } from "react-hook-form";

// ----------------------
// Validation schema
// ----------------------
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  role: z.enum(["artist", "agent", "admin", "buyer"]),
  location: z.string().min(1, "Location is required"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: undefined // Important for proper validation
    }
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      alert("User registered successfully!");
      reset();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4">
      {/* Name */}
      <div>
        <Label className="mb-2">Name</Label>
        <Input placeholder="Aster Kebede" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <Label className="mb-2">Email</Label>
        <Input placeholder="aster@example.com" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <Label className="mb-2">Phone</Label>
        <Input placeholder="0911222333" {...register("phone")} />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Role - Using Controller */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="mb-2">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artist</SelectItem>

                  <SelectItem value="buyer">Buyer</SelectItem>
                  {/**
                   * <SelectItem value="admin">Admin</SelectItem>
                   *  <SelectItem value="agent">Agent</SelectItem>
                   */}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Location */}
        <div>
          <Label className="mb-2">Location</Label>
          <Input placeholder="Addis Ababa" {...register("location")} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
      </div>



      {/* Submit */}
      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}