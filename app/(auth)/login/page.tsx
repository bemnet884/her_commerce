"use client";

import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/validations/auth";

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    setServerError(null);

    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validationResult = signInSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await signInAction(formData);

      if (result.success) {
        router.push("/");
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign In
        </h1>

        <form action={handleSubmit} className="flex flex-col gap-4">
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
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}