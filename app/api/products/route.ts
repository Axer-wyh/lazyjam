import { NextRequest } from "next/server";
import { jsonError, readJsonFile, writeJsonFile } from "@/lib/data-store";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const emptyProduct: Omit<Product, "id" | "createdAt"> = {
  name: "",
  category: "clay",
  price: 0,
  imageUrl: "/images/product-placeholder.jpg",
  description: "",
  materials: [],
  inventory: 0,
  featured: false,
  status: "draft"
};

export async function GET() {
  const products = await readJsonFile<Product[]>("products.json");
  return Response.json(products);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Partial<Product>;

  if (!payload.name) {
    return jsonError("Product name is required.");
  }

  const products = await readJsonFile<Product[]>("products.json");
  const product: Product = {
    ...emptyProduct,
    ...payload,
    id: payload.id || crypto.randomUUID(),
    price: Number(payload.price || 0),
    inventory: Number(payload.inventory || 0),
    materials: Array.isArray(payload.materials) ? payload.materials : [],
    createdAt: new Date().toISOString()
  };

  const saved = await writeJsonFile("products.json", [product, ...products]);
  return Response.json(saved);
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as Product;

  if (!payload.id) {
    return jsonError("Product id is required.");
  }

  const products = await readJsonFile<Product[]>("products.json");
  const exists = products.some((product) => product.id === payload.id);

  if (!exists) {
    return jsonError("Product not found.", 404);
  }

  const nextProducts = products.map((product) =>
    product.id === payload.id
      ? {
          ...product,
          ...payload,
          price: Number(payload.price || 0),
          inventory: Number(payload.inventory || 0),
          materials: Array.isArray(payload.materials) ? payload.materials : []
        }
      : product
  );

  const saved = await writeJsonFile("products.json", nextProducts);
  return Response.json(saved);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return jsonError("Product id is required.");
  }

  const products = await readJsonFile<Product[]>("products.json");
  const saved = await writeJsonFile(
    "products.json",
    products.filter((product) => product.id !== id)
  );

  return Response.json(saved);
}
