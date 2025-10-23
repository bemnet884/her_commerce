import {
  ProductInput,
  createProduct,
  getAllProducts,
} from "@/db/(queries)/product";
import { NextResponse } from "next/server";

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artist_id, name, description, images, price, status } =
      body as ProductInput;

    // Basic validation
    if (!artist_id || !name || !price) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: artist_id, name, and price are required",
        },
        { status: 400 }
      );
    }

    const newProduct = await createProduct({
      artist_id,
      name,
      description,
      images,
      price,
      status: status || "pending",
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
