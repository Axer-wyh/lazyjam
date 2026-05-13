import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(orders);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  if (!payload.customer) {
    return jsonError("Customer name is required.");
  }

  const order = await prisma.order.create({
    data: {
      id: payload.id || undefined,
      customer: payload.customer,
      email: payload.email || "",
      shipping: payload.shipping || "",
      payment: payload.payment || "",
      productId: payload.productId || "",
      productName: payload.productName || "",
      quantity: Number(payload.quantity || 1),
      total: Number(payload.total || 0),
      status: payload.status || "pending",
      note: payload.note || "",
    },
  });

  return Response.json(order);
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  if (!payload.id) {
    return jsonError("Order id is required.");
  }

  const order = await prisma.order.update({
    where: { id: payload.id },
    data: {
      customer: payload.customer,
      email: payload.email || undefined,
      shipping: payload.shipping || undefined,
      payment: payload.payment || undefined,
      productId: payload.productId || undefined,
      productName: payload.productName || undefined,
      quantity: Number(payload.quantity || 1),
      total: Number(payload.total || 0),
      status: payload.status || "pending",
      note: payload.note || "",
    },
  });

  return Response.json(order);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return jsonError("Order id is required.");
  }

  await prisma.order.delete({ where: { id } });
  return Response.json({ success: true });
}