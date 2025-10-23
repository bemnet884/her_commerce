import { eq } from "drizzle-orm";
import db from "../drizzle";
import { users } from "../schema";
import { cache } from "react";
import { UserInput } from "@/types/user";

// ----------------------
// CREATE USER
// ----------------------
export const createUser = async (input: UserInput) => {
  const newUser = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      location: input.location,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      location: users.location,
    });

  return newUser;
};

// ----------------------
// GET ALL USERS
// ----------------------
export const getAllUsers = cache(async () => {
  const allUsers = await db.select().from(users);
  return allUsers;
});

// ----------------------
// GET USER BY ID
// ----------------------
export const getUserById = cache(async (id: number) => {
  const user = await db.select().from(users).where(eq(users.id, id));

  return user;
});

// ----------------------
// UPDATE USER
// ----------------------
export const updateUser = async (id: number, input: Partial<UserInput>) => {
  const updatedUser = await db
    .update(users)
    .set(input)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      location: users.location,
    });

  return updatedUser;
};

// ----------------------
// DELETE USER
// ----------------------
export const deleteUser = async (id: number) => {
  const deletedUser = await db.delete(users).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  });

  return deletedUser;
};
