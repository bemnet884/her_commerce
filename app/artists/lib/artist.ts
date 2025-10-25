import { eq, and, desc } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  artistProfiles,
  user,
  products,
  productCategories,
  reviews,
  agentArtists,
  agentProfiles,
  userRoles,
  roles,
} from "@/db/schema";

// Type definitions
export type Artist = {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string | null;
  specialization: string | null;
  experienceYears: number | null;
  location: string | null;
  contactPhone: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stockQuantity: number;
  createdAt: Date;
  category: { name: string };
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  product: { name: string };
  buyer: { name: string };
};

export type Agent = {
  id: string;
  name: string;
  region: string | null;
  contactPhone: string | null;
};

export type ArtistDetails = {
  artist: Artist;
  products: Product[];
  reviews: Review[];
  assignedAgent?: Agent;
  averageRating: number;
};

export async function getArtistDetails(
  artistId: string
): Promise<ArtistDetails | null> {
  // Run queries concurrently
  const [artistResult, productsList, reviewsList, assignedAgentResult] =
    await Promise.all([
      // Artist info
      db
        .select({
          id: artistProfiles.id,
          userId: artistProfiles.userId,
          name: user.name,
          email: user.email,
          bio: artistProfiles.bio,
          specialization: artistProfiles.specialization,
          experienceYears: artistProfiles.experienceYears,
          location: artistProfiles.location,
          contactPhone: artistProfiles.contactPhone,
          isVerified: artistProfiles.isVerified,
          createdAt: artistProfiles.createdAt,
          updatedAt: artistProfiles.updatedAt,
        })
        .from(artistProfiles)
        .innerJoin(user, eq(artistProfiles.userId, user.id))
        .where(eq(artistProfiles.id, artistId))
        .then((res) => res[0]),

      // Products
      db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          images: products.images,
          stockQuantity: products.stockQuantity,
          createdAt: products.createdAt,
          category: { name: productCategories.name },
        })
        .from(products)
        .innerJoin(
          productCategories,
          eq(products.categoryId, productCategories.id)
        )
        .where(
          and(eq(products.artistId, artistId), eq(products.isActive, true))
        )
        .orderBy(desc(products.createdAt))
        .limit(8),

      // Reviews
      db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          product: { name: products.name },
          buyer: { name: user.name },
        })
        .from(reviews)
        .innerJoin(products, eq(reviews.productId, products.id))
        .innerJoin(user, eq(reviews.buyerId, user.id))
        .where(eq(products.artistId, artistId))
        .orderBy(desc(reviews.createdAt))
        .limit(5),

      // Assigned agent
      db
        .select({
          agent: {
            id: agentProfiles.id,
            name: user.name,
            region: agentProfiles.region,
            contactPhone: agentProfiles.contactPhone,
          },
        })
        .from(agentArtists)
        .innerJoin(agentProfiles, eq(agentArtists.agentId, agentProfiles.id))
        .innerJoin(user, eq(agentProfiles.userId, user.id))
        .where(
          and(
            eq(agentArtists.artistId, artistId),
            eq(agentArtists.isActive, true)
          )
        )
        .then((res) => res[0]?.agent),
    ]);

  if (!artistResult) return null;

  const averageRating = reviewsList.length
    ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
    : 0;

  return {
    artist: {
      ...artistResult,
      isVerified: artistResult.isVerified ?? false, // default to false if null
      bio: artistResult.bio ?? "",
      specialization: artistResult.specialization ?? "",
      experienceYears: artistResult.experienceYears ?? 0,
      location: artistResult.location ?? "",
      contactPhone: artistResult.contactPhone ?? "",
    },
    products: productsList.map((p) => ({
      ...p,
      description: p.description ?? "", // default to empty string
      price: Number(p.price), // ensure it's a number
    })),
    reviews: reviewsList.map((r) => ({
      ...r,
      comment: r.comment ?? "",
    })),
    assignedAgent: assignedAgentResult,
    averageRating,
  };
}

// Fetch user roles
export async function getUserRoles(userId: string): Promise<string[]> {
  const rolesList = await db
    .select({ roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return rolesList.map((r) => r.roleName);
}
