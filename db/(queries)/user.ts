import { eq } from "drizzle-orm";
import db from "../drizzle";
import { cache } from "react";
import { UserInput } from "@/types/user";
import { user } from "../schema";

// ----------------------
// CREATE USER
// ----------------------
export const createUser = async (input: UserInput) => {
  const newUser = await db
    .insert(user)
    .values({
      id: input.id, // provide UUID or string id
      name: input.name,
      email: input.email,
      image: input.image,
      emailVerified: input.emailVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });

  return newUser[0]; // insert returns array
};

// ----------------------
// GET ALL USERS
// ----------------------
/**
 * export const getAllUsers = cache(async () => {
  const allUsers = await db.select().from(user);
  return allUsers;
});

// ----------------------
// GET USER BY ID
// ----------------------
export const getUserById = cache(async (id: string) => {
  const result = await db.select().from(user).where(eq(user.id, id));
  return result[0] ?? null;
});

// ----------------------
// UPDATE USER
// ----------------------
export const updateUser = async (id: string, input: Partial<UserInput>) => {
  const updatedUser = await db
    .update(user)
    .set({ ...input, updated_at: new Date() })
    .where(eq(user.id, id))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      bio: user.bio,
      location: user.location,
      image: user.image,
      emailVerified: user.emailVerified,
      is_approved: user.is_approved,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });

  return updatedUser[0] ?? null;
};

// ----------------------
// DELETE USER
// ----------------------
export const deleteUser = async (id: string) => {
  const deletedUser = await db.delete(user).where(eq(user.id, id)).returning({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  return deletedUser[0] ?? null;
};

 */