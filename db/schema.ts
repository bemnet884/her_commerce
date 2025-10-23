// src/db/schema.ts
import {
  pgTable,
  pgEnum,
  serial,
  integer,
  varchar,
  text,
  numeric,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

// ----------------------
// Helper: timestamps
// ----------------------
const timestamps = {
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at"),
  deleted_at: timestamp("deleted_at"),
};

// ----------------------
// Roles Enum
// ----------------------
export const rolesEnum = pgEnum("roles", ["artist", "agent", "admin", "buyer"]);

// ----------------------
// Users Table
// ----------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  role: rolesEnum().default("artist").notNull(),
  //TODO: Bio for artists
  location: varchar("location", { length: 255 }).notNull(),
  ...timestamps,
});

// ----------------------
// Products Table
// ----------------------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  artist_id: integer("artist_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  images: json("images"),
  price: numeric("price"),
  status: varchar("status", { length: 20 }).default("pending"),
  ...timestamps,
  //
});

//TODO number of product
// Rating and comment

// ----------------------
// Orders Table
// ----------------------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyer_id: integer("buyer_id")
    .references(() => users.id)
    .notNull(),
  product_id: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").default(1),
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed
  ...timestamps,
});

// ----------------------
// Agent Requests Table
// ----------------------
export const agent_requests = pgTable("agent_requests", {
  id: serial("id").primaryKey(),
  artist_id: integer("artist_id")
    .references(() => users.id)
    .notNull(),
  agent_id: integer("agent_id").references(() => users.id),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, completed
  location: varchar("location", { length: 255 }).notNull(),
  ...timestamps,
});

export const schema = {
  users,
  products,
  orders,
  agent_requests,
};
