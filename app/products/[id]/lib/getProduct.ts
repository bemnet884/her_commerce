import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  products,
  productCategories,
  artistProfiles,
  user,
  reviews,
} from "@/db/schema";
import { notFound } from "next/navigation";

export async function getProduct(id: string) {
  // Fetch product with artist and category
  const product = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      originalPrice: products.originalPrice,
      images: products.images,
      stockQuantity: products.stockQuantity,
      materials: products.materials,
      tags: products.tags,
      dimensions: products.dimensions,
      weight: products.weight,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: productCategories.id,
        name: productCategories.name,
        description: productCategories.description,
      },
      artist: {
        id: artistProfiles.id,
        userId: artistProfiles.userId,
        name: user.name,
        bio: artistProfiles.bio,
        location: artistProfiles.location,
        specialization: artistProfiles.specialization,
        experienceYears: artistProfiles.experienceYears,
        isVerified: artistProfiles.isVerified,
      },
    })
    .from(products)
    .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
    .innerJoin(artistProfiles, eq(products.artistId, artistProfiles.id))
    .innerJoin(user, eq(artistProfiles.userId, user.id))
    .where(eq(products.id, id))
    .then((res) => res[0]);

  if (!product) notFound();

  // Fetch reviews for product
  const productReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      isVerifiedPurchase: reviews.isVerifiedPurchase,
      buyer: {
        id: user.id,
        name: user.name,
      },
    })
    .from(reviews)
    .innerJoin(user, eq(reviews.buyerId, user.id))
    .where(eq(reviews.productId, id))
    .orderBy(reviews.createdAt);

  return { product, reviews: productReviews };
}
