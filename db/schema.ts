import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  json,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Existing BetterAuth tables (you already have these)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// New tables for your application

// Roles table for flexible role management
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // 'admin', 'artist', 'agent', 'buyer'
  description: text("description"),
  permissions: json("permissions").$type<string[]>(), // Array of permissions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User roles junction table (many-to-many)
export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    assignedBy: text("assigned_by").references(() => user.id),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);

// Artist profile (extends user information)
export const artistProfiles = pgTable("artist_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio"),
  specialization: text("specialization"), // e.g., 'pottery', 'weaving', 'jewelry'
  experienceYears: integer("experience_years"),
  location: text("location"),
  contactPhone: text("contact_phone"),
  isVerified: boolean("is_verified").default(false),
  verificationDocuments: json("verification_documents").$type<string[]>(), // Array of document URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Agent profile
export const agentProfiles = pgTable("agent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
  contactPhone: text("contact_phone").notNull(),
  idNumber: text("id_number"), // Government ID for verification
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by").references(() => user.id), // Admin who verified
  verifiedAt: timestamp("verified_at"),
  maxArtists: integer("max_artists").default(10), // Maximum artists this agent can handle
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const agentArtists = pgTable("agent_artists", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  artistId: uuid("artist_id")
    .notNull()
    .references(() => artistProfiles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

// Product categories
export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  images: json("images").$type<string[]>().notNull(), // Array of image URLs
  categoryId: uuid("category_id")
    .notNull()
    .references(() => productCategories.id),
  artistId: uuid("artist_id")
    .notNull()
    .references(() => artistProfiles.id, { onDelete: "cascade" }),
  stockQuantity: integer("stock_quantity").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  dimensions: json("dimensions").$type<{
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  }>(),
  materials: json("materials").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  weight: decimal("weight", { precision: 8, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled
  shippingAddress: json("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  }>(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Define relations
export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRoles),
  artistProfile: many(artistProfiles),
  agentProfile: many(agentProfiles),
  orders: many(orders),
  reviews: many(reviews),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const artistProfilesRelations = relations(
  artistProfiles,
  ({ one, many }) => ({
    user: one(user, {
      fields: [artistProfiles.userId],
      references: [user.id],
    }),
    products: many(products),
    agentArtists: many(agentArtists),
  })
);

export const agentProfilesRelations = relations(
  agentProfiles,
  ({ one, many }) => ({
    user: one(user, {
      fields: [agentProfiles.userId],
      references: [user.id],
    }),
    verifiedByAdmin: one(user, {
      fields: [agentProfiles.verifiedBy],
      references: [user.id],
    }),
    agentArtists: many(agentArtists),
  })
);

export const agentArtistsRelations = relations(agentArtists, ({ one }) => ({
  agent: one(agentProfiles, {
    fields: [agentArtists.agentId],
    references: [agentProfiles.id],
  }),
  artist: one(artistProfiles, {
    fields: [agentArtists.artistId],
    references: [artistProfiles.id],
  }),
}));

export const artistSupport = pgTable("artist_support", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id")
    .notNull()
    .references(() => artistProfiles.id, { onDelete: "cascade" }),
  supporterId: text("supporter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'one-time', 'monthly'
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const artistSupportRelations = relations(artistSupport, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [artistSupport.artistId],
    references: [artistProfiles.id],
  }),
  supporter: one(user, {
    fields: [artistSupport.supporterId],
    references: [user.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  artist: one(artistProfiles, {
    fields: [products.artistId],
    references: [artistProfiles.id],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(user, {
    fields: [orders.buyerId],
    references: [user.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  buyer: one(user, {
    fields: [reviews.buyerId],
    references: [user.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  roles,
  userRoles,
  artistProfiles,
  agentProfiles,
  agentArtists,
  productCategories,
  products,
  orders,
  orderItems,
  reviews,
  userRelations,
  rolesRelations,
  artistProfilesRelations,
  agentProfilesRelations,
  agentArtistsRelations,
  productsRelations,
  ordersRelations,
  orderItemsRelations,
  reviewsRelations,
};