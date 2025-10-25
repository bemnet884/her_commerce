import {
  roles,
  userRoles,
  user,
  artistProfiles,
  agentProfiles,
  agentArtists,
  productCategories,
  products,
  orders,
  orderItems,
  reviews,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import db from "./drizzle";

// Ethiopian names data
const ethiopianNames = {
  female: [
    "Hana",
    "Marta",
    "Selam",
    "Eyerusalem",
    "Kalkidan",
    "Birtukan",
    "Mihret",
    "Tigist",
    "Hirut",
    "Yeshi",
    "Alem",
    "Zufan",
    "Mekdes",
    "Rahel",
    "Saron",
    "Bethelhem",
    "Lydia",
    "Ruth",
    "Sarah",
    "Deborah",
    "Esther",
    "Mariam",
    "Helen",
    "Fana",
    "Saba",
    "Mimi",
    "Nardos",
    "Mahlet",
    "Meron",
    "Yodit",
  ],
  male: [
    "Dawit",
    "Solomon",
    "Mikias",
    "Yonas",
    "Nathan",
    "Ephrem",
    "Samuel",
    "Daniel",
    "Michael",
    "Gabriel",
    "Tewodros",
    "Menelik",
    "Haile",
    "Bereket",
    "Kibrom",
    "Nahom",
    "Yohannes",
    "Tesfaye",
    "Getachew",
    "Asrat",
    "Mulugeta",
    "Workneh",
    "Kassa",
    "Abebe",
    "Girma",
    "Fikru",
    "Tadesse",
    "Mengistu",
    "Bekele",
    "Alemu",
  ],
  lastNames: [
    "Gebre",
    "Tesfaye",
    "Hailu",
    "Mekonnen",
    "Assefa",
    "Tadesse",
    "Kebede",
    "Getachew",
    "Worku",
    "Mulugeta",
    "Abebe",
    "Girma",
    "Alemu",
    "Bekele",
    "Demissie",
    "Fantahun",
    "Gebremariam",
    "Hagos",
    "Kassa",
    "Negash",
  ],
};

// Product categories
const categories = [
  {
    name: "Handwoven Textiles",
    description: "Traditional Ethiopian woven fabrics and textiles",
    image: "/categories/weaving.jpg",
  },
  {
    name: "Pottery & Ceramics",
    description: "Handcrafted clay pots and ceramic items",
    image: "/categories/pottery.jpg",
  },
  {
    name: "Jewelry",
    description: "Traditional Ethiopian jewelry and accessories",
    image: "/categories/jewelry.jpg",
  },
  {
    name: "Basketry",
    description: "Handwoven baskets and storage items",
    image: "/categories/basketry.jpg",
  },
  {
    name: "Leather Crafts",
    description: "Leather goods and traditional items",
    image: "/categories/leather.jpg",
  },
  {
    name: "Wood Carvings",
    description: "Hand-carved wooden items and sculptures",
    image: "/categories/woodcarving.jpg",
  },
];

// Artistic products data
const artisticProducts = [
  // Handwoven Textiles
  {
    name: "Habesha Kemis Cotton Dress",
    description:
      "Traditional Ethiopian handwoven cotton dress with intricate patterns. Made from pure cotton using traditional weaving techniques passed down through generations.",
    price: "4500.00",
    category: "Handwoven Textiles",
    materials: ["Cotton", "Natural Dyes"],
    tags: ["traditional", "dress", "cotton", "handwoven"],
    dimensions: { length: 150, width: 60, height: 5, unit: "cm" },
    weight: "0.8",
  },
  {
    name: "Netela Shawl",
    description:
      "Beautiful white cotton shawl with colorful borders, perfect for traditional ceremonies and daily wear. Lightweight and versatile.",
    price: "1200.00",
    category: "Handwoven Textiles",
    materials: ["Cotton", "Silk Border"],
    tags: ["shawl", "cotton", "ceremonial", "lightweight"],
    dimensions: { length: 200, width: 90, height: 2, unit: "cm" },
    weight: "0.3",
  },
  {
    name: "Gabbi Blanket",
    description:
      "Thick handwoven blanket perfect for cold evenings. Made with traditional patterns and natural wool.",
    price: "3200.00",
    category: "Handwoven Textiles",
    materials: ["Wool", "Cotton"],
    tags: ["blanket", "wool", "warm", "traditional"],
    dimensions: { length: 220, width: 180, height: 3, unit: "cm" },
    weight: "2.5",
  },

  // Pottery & Ceramics
  {
    name: "Traditional Coffee Pot (Jebena)",
    description:
      "Handcrafted clay coffee pot used in traditional Ethiopian coffee ceremonies. Each piece is unique and made with local clay.",
    price: "1800.00",
    category: "Pottery & Ceramics",
    materials: ["Clay", "Natural Glaze"],
    tags: ["coffee", "traditional", "ceremonial", "clay"],
    dimensions: { length: 25, width: 20, height: 30, unit: "cm" },
    weight: "1.2",
  },
  {
    name: "Ceramic Incense Burner",
    description:
      "Beautiful hand-painted ceramic incense burner with traditional Ethiopian motifs. Perfect for home decoration.",
    price: "950.00",
    category: "Pottery & Ceramics",
    materials: ["Ceramic", "Natural Pigments"],
    tags: ["incense", "decorative", "ceramic", "hand-painted"],
    dimensions: { length: 15, width: 15, height: 10, unit: "cm" },
    weight: "0.6",
  },
  {
    name: "Set of Clay Mugs",
    description:
      "Set of 4 hand-thrown clay mugs, each with unique traditional patterns. Perfect for coffee or tea.",
    price: "1600.00",
    category: "Pottery & Ceramics",
    materials: ["Clay", "Natural Sealant"],
    tags: ["mugs", "set", "clay", "handmade"],
    dimensions: { length: 12, width: 12, height: 15, unit: "cm" },
    weight: "2.0",
  },

  // Jewelry
  {
    name: "Silver Cross Pendant",
    description:
      "Handcrafted silver cross pendant with traditional Ethiopian design. Comes with leather cord.",
    price: "2800.00",
    category: "Jewelry",
    materials: ["Silver", "Leather"],
    tags: ["cross", "silver", "pendant", "religious"],
    dimensions: { length: 8, width: 5, height: 1, unit: "cm" },
    weight: "0.05",
  },
  {
    name: "Beaded Necklace Set",
    description:
      "Set of three beaded necklaces using traditional Ethiopian beads and patterns. Colorful and vibrant.",
    price: "1500.00",
    category: "Jewelry",
    materials: ["Glass Beads", "Cotton Cord"],
    tags: ["necklace", "beaded", "colorful", "set"],
    dimensions: { length: 50, width: 2, height: 2, unit: "cm" },
    weight: "0.1",
  },
  {
    name: "Traditional Earrings",
    description:
      "Handmade silver earrings with intricate filigree work. Lightweight and comfortable to wear.",
    price: "1200.00",
    category: "Jewelry",
    materials: ["Silver", "Copper"],
    tags: ["earrings", "silver", "filigree", "traditional"],
    dimensions: { length: 6, width: 3, height: 1, unit: "cm" },
    weight: "0.02",
  },

  // Basketry
  {
    name: "Colorful Storage Basket",
    description:
      "Medium-sized handwoven basket with colorful patterns. Perfect for storage or as decorative piece.",
    price: "850.00",
    category: "Basketry",
    materials: ["Grass", "Natural Dyes"],
    tags: ["basket", "storage", "colorful", "handwoven"],
    dimensions: { length: 35, width: 35, height: 25, unit: "cm" },
    weight: "0.4",
  },
  {
    name: "Traditional Bread Basket",
    description:
      "Large flat basket traditionally used for serving injera. Beautiful natural patterns.",
    price: "2200.00",
    category: "Basketry",
    materials: ["Reed", "Grass"],
    tags: ["basket", "injera", "serving", "traditional"],
    dimensions: { length: 60, width: 60, height: 8, unit: "cm" },
    weight: "0.8",
  },
  {
    name: "Small Decorative Basket",
    description:
      "Small handwoven basket with intricate patterns, perfect for keys or small items.",
    price: "450.00",
    category: "Basketry",
    materials: ["Grass", "Natural Fibers"],
    tags: ["basket", "decorative", "small", "handwoven"],
    dimensions: { length: 15, width: 15, height: 10, unit: "cm" },
    weight: "0.1",
  },

  // Leather Crafts
  {
    name: "Hand-tooled Leather Bag",
    description:
      "Beautiful leather bag with traditional Ethiopian tooling patterns. Durable and stylish.",
    price: "3800.00",
    category: "Leather Crafts",
    materials: ["Leather", "Brass Fittings"],
    tags: ["bag", "leather", "tooled", "traditional"],
    dimensions: { length: 30, width: 15, height: 40, unit: "cm" },
    weight: "1.0",
  },
  {
    name: "Traditional Shield Replica",
    description:
      "Decorative leather shield replica with traditional designs. Perfect for wall decoration.",
    price: "4200.00",
    category: "Leather Crafts",
    materials: ["Leather", "Wood", "Brass"],
    tags: ["shield", "decorative", "leather", "replica"],
    dimensions: { length: 80, width: 50, height: 10, unit: "cm" },
    weight: "3.5",
  },

  // Wood Carvings
  {
    name: "Hand-carved Coffee Table",
    description:
      "Beautiful coffee table with intricate hand-carved traditional motifs. Made from solid wood.",
    price: "12500.00",
    category: "Wood Carvings",
    materials: ["Solid Wood", "Natural Oil Finish"],
    tags: ["table", "coffee", "carved", "furniture"],
    dimensions: { length: 120, width: 60, height: 45, unit: "cm" },
    weight: "15.0",
  },
  {
    name: "Set of Wooden Spoons",
    description:
      "Set of 6 hand-carved wooden spoons with traditional handles. Food-safe finish.",
    price: "950.00",
    category: "Wood Carvings",
    materials: ["Wood", "Food-safe Oil"],
    tags: ["spoons", "set", "wooden", "kitchen"],
    dimensions: { length: 25, width: 8, height: 3, unit: "cm" },
    weight: "0.6",
  },
];

// Generate random Ethiopian name
function generateEthiopianName(gender: "male" | "female") {
  const firstNames = ethiopianNames[gender];
  const lastName =
    ethiopianNames.lastNames[
      Math.floor(Math.random() * ethiopianNames.lastNames.length)
    ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}

// Generate random phone number
function generatePhoneNumber() {
  return `+2519${Math.floor(Math.random() * 90 + 10)}${Math.floor(Math.random() * 900000 + 100000)}`;
}

// Generate random location in Ethiopia
function generateLocation() {
  const locations = [
    "Addis Ababa",
    "Bahir Dar",
    "Gondar",
    "Hawassa",
    "Dire Dawa",
    "Mekele",
    "Jimma",
    "Adama",
    "Arba Minch",
    "Harar",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Generate random region
function generateRegion() {
  const regions = [
    "Amhara",
    "Oromia",
    "SNNPR",
    "Tigray",
    "Somali",
    "Afar",
    "Dire Dawa",
    "Harari",
    "Addis Ababa",
  ];
  return regions[Math.floor(Math.random() * regions.length)];
}

// Specializations for artists
const specializations = [
  "Weaving",
  "Pottery",
  "Jewelry Making",
  "Basketry",
  "Leather Work",
  "Wood Carving",
  "Textile Art",
  "Metal Work",
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (optional - be careful in production!)
    console.log("🧹 Clearing existing data...");
    await db.delete(reviews);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(productCategories);
    await db.delete(agentArtists);
    await db.delete(artistProfiles);
    await db.delete(agentProfiles);
    await db.delete(userRoles);
    await db.delete(roles);
    await db.delete(user);

    // Create roles
    console.log("👥 Creating roles...");
    const roleData = [
      {
        name: "admin",
        description: "Platform administrator",
        permissions: ["all"],
      },
      {
        name: "artist",
        description: "Handcraft artisan",
        permissions: ["create_products", "manage_own_products"],
      },
      {
        name: "agent",
        description: "Sales agent",
        permissions: ["manage_artists", "view_reports"],
      },
      {
        name: "buyer",
        description: "Customer",
        permissions: ["purchase_products", "write_reviews"],
      },
    ];

    const createdRoles = await db.insert(roles).values(roleData).returning();
    const roleMap = createdRoles.reduce(
      (acc, role) => {
        acc[role.name] = role.id;
        return acc;
      },
      {} as Record<string, string>
    );

    // Create admin user
    console.log("👑 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const adminUser = await db
      .insert(user)
      .values({
        id: "admin-001",
        name: "System Administrator",
        email: "admin@sheconnect.com",
        password: hashedPassword,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db.insert(userRoles).values({
      userId: adminUser[0].id,
      roleId: roleMap.admin,
      assignedBy: adminUser[0].id,
    });

    // Create artists
    console.log("🎨 Creating artists...");
    const artists = [];
    for (let i = 0; i < 15; i++) {
      const gender = Math.random() > 0.5 ? "female" : "male";
      const name = generateEthiopianName(gender);
      const email = `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@gmail.com`;

      const userData = await db
        .insert(user)
        .values({
          id: `artist-${i + 1}`,
          name: name.fullName,
          email: email,
          password: await bcrypt.hash("password123", 12),
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      await db.insert(userRoles).values({
        userId: userData[0].id,
        roleId: roleMap.artist,
        assignedBy: adminUser[0].id,
      });

      const artistProfile = await db
        .insert(artistProfiles)
        .values({
          userId: userData[0].id,
          bio: `Traditional ${specializations[i % specializations.length]} artisan from ${generateLocation()}. Passionate about preserving Ethiopian cultural heritage through handmade crafts.`,
          specialization: specializations[i % specializations.length],
          experienceYears: Math.floor(Math.random() * 20) + 5,
          location: generateLocation(),
          contactPhone: generatePhoneNumber(),
          isVerified: true,
          verificationDocuments: [],
        })
        .returning();

      artists.push({ user: userData[0], profile: artistProfile[0] });
    }

    // Create agents
    console.log("🤝 Creating agents...");
    const agents = [];
    for (let i = 0; i < 5; i++) {
      const gender = Math.random() > 0.5 ? "female" : "male";
      const name = generateEthiopianName(gender);
      const email = `agent.${name.firstName.toLowerCase()}@gmail.com`;

      const userData = await db
        .insert(user)
        .values({
          id: `agent-${i + 1}`,
          name: name.fullName,
          email: email,
          password: await bcrypt.hash("password123", 12),
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      await db.insert(userRoles).values({
        userId: userData[0].id,
        roleId: roleMap.agent,
        assignedBy: adminUser[0].id,
      });

      const agentProfile = await db
        .insert(agentProfiles)
        .values({
          userId: userData[0].id,
          region: generateRegion(),
          contactPhone: generatePhoneNumber(),
          idNumber: `ID${Math.floor(Math.random() * 1000000)}`,
          isVerified: true,
          verifiedBy: adminUser[0].id,
          verifiedAt: new Date(),
          maxArtists: 15,
        })
        .returning();

      agents.push({ user: userData[0], profile: agentProfile[0] });
    }

    // Assign artists to agents
    console.log("🔗 Assigning artists to agents...");
    for (let i = 0; i < artists.length; i++) {
      const agent = agents[i % agents.length];
      await db.insert(agentArtists).values({
        agentId: agent.profile.id,
        artistId: artists[i].profile.id,
        assignedAt: new Date(),
        isActive: true,
      });
    }

    // Create product categories
    console.log("📦 Creating product categories...");
    const createdCategories = await db
      .insert(productCategories)
      .values(categories)
      .returning();
    const categoryMap = createdCategories.reduce(
      (acc, category) => {
        acc[category.name] = category.id;
        return acc;
      },
      {} as Record<string, string>
    );

    // Create products
    console.log("🛍️ Creating products...");
    for (const productData of artisticProducts) {
      const artist = artists[Math.floor(Math.random() * artists.length)];
      const imageNumber = Math.floor(Math.random() * 10) + 1;

      await db.insert(products).values({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: (parseFloat(productData.price) * 1.2).toFixed(2),
        images: [
          `/products/product-${imageNumber}.jpg`,
          `/products/product-${imageNumber}-2.jpg`,
        ],
        categoryId: categoryMap[productData.category],
        artistId: artist.profile.id,
        stockQuantity: Math.floor(Math.random() * 20) + 5,
        isActive: true,
        dimensions: productData.dimensions,
        materials: productData.materials,
        tags: productData.tags,
        weight: productData.weight,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Create some buyers and orders
    console.log("🛒 Creating buyers and sample orders...");
    for (let i = 0; i < 8; i++) {
      const gender = Math.random() > 0.5 ? "female" : "male";
      const name = generateEthiopianName(gender);
      const email = `buyer.${name.firstName.toLowerCase()}@gmail.com`;

      const buyerUser = await db
        .insert(user)
        .values({
          id: `buyer-${i + 1}`,
          name: name.fullName,
          email: email,
          password: await bcrypt.hash("password123", 12),
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      await db.insert(userRoles).values({
        userId: buyerUser[0].id,
        roleId: roleMap.buyer,
        assignedBy: adminUser[0].id,
      });

      // Create sample order for some buyers
      if (i < 3) {
        const order = await db
          .insert(orders)
          .values({
            orderNumber: `ORD${Date.now()}${i}`,
            buyerId: buyerUser[0].id,
            totalAmount: "0.00", // Will update after order items
            status: "delivered",
            shippingAddress: {
              street: "Bole Road",
              city: "Addis Ababa",
              state: "Addis Ababa",
              country: "Ethiopia",
              zipCode: "1000",
              phone: generatePhoneNumber(),
            },
            paymentStatus: "paid",
            paymentMethod: "bank_transfer",
          })
          .returning();

        // Get some random products for order items
        const allProducts = await db.select().from(products).limit(3);
        let orderTotal = 0;

        for (const product of allProducts) {
          const quantity = Math.floor(Math.random() * 2) + 1;
          const subtotal = parseFloat(product.price) * quantity;
          orderTotal += subtotal;

          await db.insert(orderItems).values({
            orderId: order[0].id,
            productId: product.id,
            quantity: quantity,
            unitPrice: product.price,
            subtotal: subtotal.toFixed(2),
          });

          // Create review for delivered orders
          await db.insert(reviews).values({
            productId: product.id,
            buyerId: buyerUser[0].id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            comment:
              "Beautiful craftsmanship! The product exceeded my expectations.",
            isVerifiedPurchase: true,
          });
        }

        // Update order total
        await db
          .update(orders)
          .set({ totalAmount: orderTotal.toFixed(2) })
          .where(eq(orders.id, order[0].id));
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log("📊 Seed Summary:");
    console.log(`   - Roles: ${createdRoles.length}`);
    console.log(`   - Artists: ${artists.length}`);
    console.log(`   - Agents: ${agents.length}`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${artisticProducts.length}`);
    console.log(
      "🎉 Your SheConnect+ platform is ready with Ethiopian artisan data!"
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seed };
