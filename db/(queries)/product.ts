// src/db/(queries)/product.ts
import { eq } from "drizzle-orm";
import db from "../drizzle";
import { products } from "../schema";

export type ProductInput = {
  artist_id: number;
  name: string;
  description?: string;
  images?: string[];
  price: string;
  quantity: number;
  status?: "pending" | "approved" | "sold";
};

export const createProduct = async (data: ProductInput) => {
  const newProduct = await db.insert(products).values(data).returning({
    id: products.id,
    name: products.name,
    artist_id: products.artist_id,
    quantity: products.quantity,
    status: products.status,
  });

  return newProduct[0];
};

export const getAllProducts = async () => {
  return db.select().from(products);
};

export const getProductById = async (id: number) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
  });
};

export const updateProduct = async (
  id: number,
  data: Partial<ProductInput>
) => {
  const updatedProduct = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning({
      id: products.id,
      name: products.name,
      artist_id: products.artist_id,
      quantity: products.quantity,
      status: products.status,
    });

  return updatedProduct[0];
};

export const deleteProduct = async (id: number) => {
  const deletedProduct = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({
      id: products.id,
      name: products.name,
    });

  return deletedProduct[0];
};
