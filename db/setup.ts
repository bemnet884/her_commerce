import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, products, orders, agent_requests } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

async function setupDatabase() {
  console.log("Creating tables...");

  // This will create all tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role roles DEFAULT 'artist' NOT NULL,
      location VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      artist_id INTEGER REFERENCES users(id) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      images JSON,
      price NUMERIC,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      buyer_id INTEGER REFERENCES users(id) NOT NULL,
      product_id INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS agent_requests (
      id SERIAL PRIMARY KEY,
      artist_id INTEGER REFERENCES users(id) NOT NULL,
      agent_id INTEGER REFERENCES users(id),
      status VARCHAR(20) DEFAULT 'pending',
      location VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);

  console.log("Tables created successfully!");
  await pool.end();
}

setupDatabase().catch(console.error);
