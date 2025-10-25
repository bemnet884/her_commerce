import db from "@/db/drizzle";
import { productCategories } from "@/db/schema";

export async function getCategories() {
  return await db.select().from(productCategories);
}
