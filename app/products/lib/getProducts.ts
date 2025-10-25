import { eq, desc, like, and } from "drizzle-orm";
import db from "@/db/drizzle";
import { products, productCategories, artistProfiles, user } from "@/db/schema";

export async function getProducts(searchParams: { [key: string]: string }) {
  const search = searchParams.search;
  const category = searchParams.category;
  const page = parseInt(searchParams.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  const whereConditions = [eq(products.isActive, true)];

  if (search) whereConditions.push(like(products.name, `%${search}%`));

  if (category) {
    const categoryRecord = await db.query.productCategories.findFirst({
      where: eq(productCategories.name, category),
    });
    if (categoryRecord)
      whereConditions.push(eq(products.categoryId, categoryRecord.id));
  }

  const productsData = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      images: products.images,
      stockQuantity: products.stockQuantity,
      createdAt: products.createdAt,
      category: {
        id: productCategories.id,
        name: productCategories.name,
      },
      artist: {
        id: artistProfiles.id,
        name: user.name,
        location: artistProfiles.location,
        specialization: artistProfiles.specialization,
      },
    })
    .from(products)
    .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
    .innerJoin(artistProfiles, eq(products.artistId, artistProfiles.id))
    .innerJoin(user, eq(artistProfiles.userId, user.id))
    .where(and(...whereConditions))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  const totalCount = await db
    .select({ count: products.id })
    .from(products)
    .where(and(...whereConditions));

  const totalPages = Math.ceil(totalCount.length / limit);

  return { products: productsData, totalPages, currentPage: page };
}
