// app/api/artists/[id]/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/db/drizzle";
import { artistSupport, artistProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
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

    const artistId = params.id;
    const formData = await request.formData();

    // Verify artist exists
    const artist = await db.query.artistProfiles.findFirst({
      where: eq(artistProfiles.id, artistId),
    });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const supportData = {
      artistId,
      supporterId: session.user.id,
      amount: formData.get("amount") as string,
      type: formData.get("type") as string,
      message: formData.get("message") as string,
      isAnonymous: formData.get("anonymous") === "on",
    };

    // In a real implementation, you would integrate with a payment processor here
    // For now, we'll just record the support intent
    const [supportRecord] = await db
      .insert(artistSupport)
      .values(supportData)
      .returning();

    // TODO: Integrate with payment processor (Chapa, Stripe, etc.)
    // This is where you would create a payment intent and redirect to payment page

    return NextResponse.json({
      success: true,
      supportId: supportRecord.id,
      message: "Support recorded successfully. Payment integration needed.",
    });
  } catch (error) {
    console.error("Error processing support:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
