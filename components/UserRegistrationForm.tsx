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
import { signUpAction } from "@/app/actions/auth";

// ----------------------
// Validation Schema
// ----------------------
const userSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),

    image: z.string().url("Invalid image URL").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormData = z.infer<typeof userSchema>;

// ----------------------
// Component
// ----------------------
export default function UserRegistrationForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });


  return (
    <form
      action={signUpAction}
      className="max-w-lg mx-auto space-y-5 p-6 border rounded-2xl shadow-sm bg-white"
      onSubmit={() => setLoading(true)}
    >
      <h2 className="text-xl font-semibold text-gray-800">User Registration</h2>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input placeholder="Aster Kebede" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input placeholder="aster@example.com" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="********" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label>Confirm Password</Label>
        <Input type="password" placeholder="********" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>


      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
