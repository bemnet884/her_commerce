import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/db/drizzle";
import { products, productCategories, artistProfiles } from "@/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";

// Category mapping for the form values to actual category names
const categoryMapping: { [key: string]: string } = {
  weaving: "Handwoven Textiles",
  pottery: "Pottery & Ceramics",
  jewelry: "Jewelry",
  basketry: "Basketry",
  leather: "Leather Crafts",
  wood: "Wood Carvings",
};

// -------------------- POST: Create a product --------------------
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const artistProfile = await db.query.artistProfiles.findFirst({
      where: eq(artistProfiles.userId, session.user.id),
    });

    if (!artistProfile) {
      return NextResponse.json(
        { error: "Artist profile not found." },
        { status: 400 }
      );
    }

    const categoryKey = formData.get("categoryId") as string;
    const categoryName = categoryMapping[categoryKey] || categoryKey;

    const category = await db.query.productCategories.findFirst({
      where: eq(productCategories.name, categoryName),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category selected" },
        { status: 400 }
      );
    }

    const materials =
      (formData.get("materials") as string)
        ?.split(",")
        .map((m) => m.trim())
        .filter((m) => m) || [];

    const tags =
      (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter((t) => t) || [];

    const dimensions: any = {};
    const length = formData.get("length");
    const width = formData.get("width");
    const height = formData.get("height");

    if (length) dimensions.length = parseFloat(length as string);
    if (width) dimensions.width = parseFloat(width as string);
    if (height) dimensions.height = parseFloat(height as string);
    if (Object.keys(dimensions).length > 0) dimensions.unit = "cm";

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      stockQuantity: parseInt(formData.get("stockQuantity") as string),
      categoryId: category.id,
      artistId: artistProfile.id,
      images: [],
      materials: materials.length > 0 ? materials : null,
      tags: tags.length > 0 ? tags : null,
      dimensions: Object.keys(dimensions).length > 0 ? dimensions : null,
      weight: (formData.get("weight") as string) || null,
    };

    const [newProduct] = await db
      .insert(products)
      .values(productData)
      .returning();

    return NextResponse.json(newProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// -------------------- GET: Search + Pagination --------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build search filter
    const filters = [];
    if (search) filters.push(ilike(products.name, `%${search}%`));
    if (category) filters.push(ilike(productCategories.name, `%${category}%`));

    // Fetch filtered + paginated products with join
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        category: productCategories.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(filters.length ? and(...filters) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${products.createdAt} DESC`);

    // Count total products (for pagination)
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(filters.length ? and(...filters) : undefined);

    return NextResponse.json({
      data: result,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
