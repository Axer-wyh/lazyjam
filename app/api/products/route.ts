import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(products);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  if (!payload.name) {
    return jsonError("Product name is required.");
  }

  const product = await prisma.product.create({
    data: {
      id: payload.id || undefined,
      name: payload.name,
      category: payload.category || "Clay Earrings",
      price: Number(payload.price || 0),
      imageUrl: payload.imageUrl || "/images/product-placeholder.jpg",
      description: payload.description || null,
      materials: Array.isArray(payload.materials) ? payload.materials : [],
      inventory: Number(payload.inventory || 0),
      featured: Boolean(payload.featured),
      status: payload.status || "draft",
      stockTag: payload.stockTag || null,
      cycle: payload.cycle || null,
      material: payload.material || null,
      size: payload.size || null,
      care: payload.care || null,
      note: payload.note || null,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
    },
  });

  return Response.json(product);
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  if (!payload.id) {
    return jsonError("Product id is required.");
  }

  if (!payload.name?.trim()) {
    return jsonError("Product name is required.");
  }

  const product = await prisma.product.update({
    where: { id: payload.id },
    data: {
      name: payload.name,
      category: payload.category,
      price: Number(payload.price || 0),
      imageUrl: payload.imageUrl,
      description: payload.description || null,
      materials: Array.isArray(payload.materials) ? payload.materials : [],
      inventory: Number(payload.inventory || 0),
      featured: Boolean(payload.featured),
      status: payload.status || "active",
      stockTag: payload.stockTag || null,
      cycle: payload.cycle || null,
      material: payload.material || null,
      size: payload.size || null,
      care: payload.care || null,
      note: payload.note || null,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
    },
  });

  return Response.json(product);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return jsonError("Product id is required.");
  }

  await prisma.product.delete({ where: { id } });
  return Response.json({ success: true });
}