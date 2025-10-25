// app/profile/roles/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RoleManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const requestRoleChange = async (role: string) => {
    setIsLoading(true);

    // Here you would make an API call to request role change
    // This might require admin approval for some roles

    try {
      const response = await fetch("/api/users/role-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        alert("Role change request submitted for approval");
        router.refresh();
      }
    } catch (error) {
      console.error("Error requesting role change:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Roles</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Become an Artisan</h3>
          <p className="text-gray-600 text-sm mb-3">
            Sell your handmade products on our platform
          </p>
          <Button
            onClick={() => requestRoleChange("artist")}
            disabled={isLoading}
          >
            Request Artist Role
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Become an Agent</h3>
          <p className="text-gray-600 text-sm mb-3">
            Help artisans sell their products and earn commissions
          </p>
          <Button
            onClick={() => requestRoleChange("agent")}
            disabled={isLoading}
            variant="outline"
          >
            Request Agent Role
          </Button>
        </div>
      </div>
    </div>
  );
}