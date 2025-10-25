// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/db/drizzle";
import {
  products,
  artistProfiles,
  userRoles,
  roles,
  agentArtists,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    // Get product with artist info
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        artist: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check permissions
    const userRolesData = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, session.user.id));

    const userRoleNames = userRolesData.map((ur) => ur.roleName);
    const isAdmin = userRoleNames.includes("admin");
    const isProductOwner = session.user.id === product.artist.userId;

    // Check if user is agent for this artist
    const isAgentForArtist = await db
      .select()
      .from(agentArtists)
      .where(
        and(
          eq(agentArtists.artistId, product.artistId),
          eq(agentArtists.isActive, true)
        )
      )
      .then((res) => res.length > 0);

    const canDelete =
      isAdmin ||
      isProductOwner ||
      (userRoleNames.includes("agent") && isAgentForArtist);

    if (!canDelete) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Soft delete by setting isActive to false, or hard delete:
    // Option 1: Soft delete
    await db
      .update(products)
      .set({ isActive: false })
      .where(eq(products.id, productId));

    // Option 2: Hard delete (uncomment if you prefer)
    // await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
