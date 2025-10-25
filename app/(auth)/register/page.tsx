// app/signup/page.tsx
"use client";

import { signUpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";

// Role options with descriptions
const roleOptions = [
  {
    value: "buyer",
    label: "Buyer",
    description: "I want to purchase handmade products"
  },
  {
    value: "artist",
    label: "Artisan/Creator",
    description: "I want to sell my handmade products"
  },
  {
    value: "agent",
    label: "Agent",
    description: "I want to help artisans sell their products"
  }
];

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("buyer");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    setServerError(null);

    // Add role to form data
    formData.append("role", selectedRole);

    // Client-side validation
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validationResult = signUpSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      validationResult.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof SignUpFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await signUpAction(formData);

      if (result.success) {
        // Redirect based on role
        if (selectedRole === "artist") {
          router.push("/onboarding/artist");
        } else if (selectedRole === "agent") {
          router.push("/onboarding/agent");
        } else {
          router.push("/");
        }
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Join SheConnect+
        </h1>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className={errors.name ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className={errors.email ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className={errors.password ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              I want to join as:
            </label>
            <div className="space-y-2">
              {roleOptions.map((role) => (
                <div
                  key={role.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedRole === role.value
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                    }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={selectedRole === role.value}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-gray-900 cursor-pointer">
                        {role.label}
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {serverError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-purple-600 hover:text-purple-500 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}