// lib/db/seed.ts
import db from "./drizzle";
import { users, products, orders, agent_requests } from "./schema";

export async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // First, check if tables exist and have data
    // Instead of deleting, we'll use upsert or skip deletion

    // ----------------------
    // Seed Users
    // ----------------------
    const usersData = await db
      .insert(users)
      .values([
        // Artists
        {
          name: "Emma Thompson",
          email: "emma.thompson@artist.com",
          phone: "+1-555-0101",
          role: "artist",
          location: "New York, NY",
        },
        {
          name: "James Wilson",
          email: "james.wilson@artist.com",
          phone: "+1-555-0102",
          role: "artist",
          location: "Los Angeles, CA",
        },
        {
          name: "Sophia Chen",
          email: "sophia.chen@artist.com",
          phone: "+1-555-0103",
          role: "artist",
          location: "San Francisco, CA",
        },

        // Agents
        {
          name: "Michael Rodriguez",
          email: "michael.rodriguez@agent.com",
          phone: "+1-555-0201",
          role: "agent",
          location: "Miami, FL",
        },
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@agent.com",
          phone: "+1-555-0202",
          role: "agent",
          location: "Chicago, IL",
        },

        // Buyers
        {
          name: "David Kim",
          email: "david.kim@buyer.com",
          phone: "+1-555-0301",
          role: "buyer",
          location: "Seattle, WA",
        },
        {
          name: "Lisa Anderson",
          email: "lisa.anderson@buyer.com",
          phone: "+1-555-0302",
          role: "buyer",
          location: "Boston, MA",
        },

        // Admin
        {
          name: "Admin User",
          email: "admin@artplatform.com",
          phone: "+1-555-0000",
          role: "admin",
          location: "Austin, TX",
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${usersData.length} users`);

    // Extract user IDs by role for easier reference
    const artists = usersData.filter((u) => u.role === "artist");
    const agents = usersData.filter((u) => u.role === "agent");
    const buyers = usersData.filter((u) => u.role === "buyer");

    // ----------------------
    // Seed Products
    // ----------------------
    const productsData = await db
      .insert(products)
      .values([
        {
          artist_id: artists[0].id,
          name: "Ocean Waves",
          description:
            "A beautiful acrylic painting depicting ocean waves crashing against rocks. Created with vibrant blues and greens.",
          images: [
            "https://example.com/images/ocean-waves-1.jpg",
            "https://example.com/images/ocean-waves-2.jpg",
          ],
          price: "1200.00",
          status: "approved",
        },
        {
          artist_id: artists[0].id,
          name: "Mountain Sunrise",
          description:
            "Oil painting capturing the first light of dawn over majestic mountains.",
          images: ["https://example.com/images/mountain-sunrise-1.jpg"],
          price: "1800.00",
          status: "pending",
        },
        {
          artist_id: artists[1].id,
          name: "Urban Dreams",
          description:
            "Mixed media artwork combining photography and painting to depict city life.",
          images: [
            "https://example.com/images/urban-dreams-1.jpg",
            "https://example.com/images/urban-dreams-2.jpg",
            "https://example.com/images/urban-dreams-3.jpg",
          ],
          price: "2500.00",
          status: "approved",
        },
        {
          artist_id: artists[1].id,
          name: "Desert Soul",
          description:
            "Abstract representation of desert landscapes using earth tones and textures.",
          images: ["https://example.com/images/desert-soul-1.jpg"],
          price: "950.00",
          status: "sold",
        },
        {
          artist_id: artists[2].id,
          name: "Digital Harmony",
          description:
            "Digital art piece exploring the balance between technology and nature.",
          images: [
            "https://example.com/images/digital-harmony-1.jpg",
            "https://example.com/images/digital-harmony-2.jpg",
          ],
          price: "750.00",
          status: "approved",
        },
        {
          artist_id: artists[2].id,
          name: "Silent Forest",
          description:
            "Watercolor painting of a serene forest scene with delicate details.",
          images: ["https://example.com/images/silent-forest-1.jpg"],
          price: "600.00",
          status: "pending",
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${productsData.length} products`);

    // ----------------------
    // Seed Orders
    // ----------------------
    const ordersData = await db
      .insert(orders)
      .values([
        {
          buyer_id: buyers[0].id,
          product_id: productsData[3].id, // Desert Soul (sold)
          quantity: 1,
          status: "completed",
        },
        {
          buyer_id: buyers[1].id,
          product_id: productsData[0].id, // Ocean Waves
          quantity: 1,
          status: "pending",
        },
        {
          buyer_id: buyers[0].id,
          product_id: productsData[2].id, // Urban Dreams
          quantity: 1,
          status: "pending",
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${ordersData.length} orders`);

    // ----------------------
    // Seed Agent Requests
    // ----------------------
    const agentRequestsData = await db
      .insert(agent_requests)
      .values([
        {
          artist_id: artists[0].id,
          agent_id: agents[0].id,
          status: "accepted",
          location: "New York, NY",
        },
        {
          artist_id: artists[1].id,
          agent_id: null,
          status: "pending",
          location: "Los Angeles, CA",
        },
        {
          artist_id: artists[2].id,
          agent_id: agents[1].id,
          status: "completed",
          location: "San Francisco, CA",
        },
        {
          artist_id: artists[0].id,
          agent_id: null,
          status: "pending",
          location: "Miami, FL",
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${agentRequestsData.length} agent requests`);

    console.log("Database seeding completed!");

    return {
      users: usersData,
      products: productsData,
      orders: ordersData,
      agent_requests: agentRequestsData,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .catch(console.error)
    .finally(() => process.exit());
}
