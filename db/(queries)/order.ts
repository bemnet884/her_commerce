import db from "../drizzle";
import { orders } from "../schema";
import { eq } from "drizzle-orm";

export const createOrder = async () => {
  return await db
    .insert(orders)
    .values({
      buyer_id: 4, // must be a valid buyer id
      product_id: 1, // must be a valid product id
      quantity: 2,
      status: "pending",
    })
    .returning({
      id: orders.id,
      buyer_id: orders.buyer_id,
      product_id: orders.product_id,
      status: orders.status,
    });
};

export const getAllOrders = async () => {
  return db.query.orders.findFirst();
};

export const getOrderById = async (id: number) => {
  return await db.select().from(orders).where(eq(orders.id, id));
};

export const updateOrderStatus = async (id: number, status: string) => {
  return await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning({
      id: orders.id,
      status: orders.status,
    });
};

export const deleteOrder = async (id: number) => {
  return await db
    .delete(orders)
    .where(eq(orders.id, id))
    .returning({ id: orders.id, buyer_id: orders.buyer_id });
};
