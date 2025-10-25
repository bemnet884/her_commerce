// app/actions/auth.ts
"use server";

import db from "@/db/drizzle";
import { agentProfiles, artistProfiles, userRoles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { signUpSchema, signInSchema } from "@/lib/validations/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    // Server-side validation
    const validationResult = signUpSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid form data",
      };
    }

    const { name, email, password, role } = rawData;

    // Validate role
    const validRoles = ["buyer", "artist", "agent"];
    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: "Please select a valid role",
      };
    }

    // Use BetterAuth to create user
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result.user) {
      return {
        success: false,
        error: result.user || "Failed to create account",
      };
    }

    // Get the selected role
    const selectedRole = await db.query.roles.findFirst({
      where: (roles, { eq }) => eq(roles.name, role),
    });

    if (!selectedRole) {
      return {
        success: false,
        error: "Invalid role selected",
      };
    }

    // Assign the selected role to user
    await db.insert(userRoles).values({
      userId: result.user.id,
      roleId: selectedRole.id,
      assignedBy: result.user.id, // Self-assigned during registration
    });

    // Create profile based on role
    if (role === "artist") {
      await db.insert(artistProfiles).values({
        userId: result.user.id,
        bio: "I create beautiful handmade products",
        specialization: "Handicrafts",
        location: "",
        contactPhone: "",
        isVerified: false,
      });
    } else if (role === "agent") {
      await db.insert(agentProfiles).values({
        userId: result.user.id,
        region: "",
        contactPhone: "",
        isVerified: false,
        maxArtists: 10,
      });
    }

    return {
      success: true,
      user: result.user,
      role: role,
    };
  } catch (err: any) {
    console.error("SignUp failed:", err);
    return {
      success: false,
      error: err.message || "Something went wrong. Please try again.",
    };
  }
};

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}
