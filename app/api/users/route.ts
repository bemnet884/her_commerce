// src/app/api/users/route.ts
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/db/(queries)/user";
import { NextRequest, NextResponse } from "next/server";
// adjust path to your users CRUD
import { z } from "zod";

// ----------------------
// Input validation using Zod
// ----------------------
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.enum(["artist", "agent", "admin", "buyer"]),
  bio: z.string(),
  location: z.string().min(1),
});

// ----------------------
// API Handler
// ----------------------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      const user = await getUserById(Number(id));
      return NextResponse.json(user || { error: "User not found" });
    }
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.parse(body); // validate input
    const newUser = await createUser(parsed);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) throw new Error("Missing user id");

    const updatedUser = await updateUser(Number(id), data);
    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  try {
    const deletedUser = await deleteUser(Number(id));
    return NextResponse.json(deletedUser);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
