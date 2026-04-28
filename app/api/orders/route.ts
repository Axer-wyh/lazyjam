import { NextRequest } from "next/server";
import { jsonError, readJsonFile, writeJsonFile } from "@/lib/data-store";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await readJsonFile<Order[]>("orders.json");
  return Response.json(orders);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Partial<Order>;

  if (!payload.customer) {
    return jsonError("Customer name is required.");
  }

  const orders = await readJsonFile<Order[]>("orders.json");
  const order: Order = {
    id: payload.id || crypto.randomUUID(),
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
    createdAt: new Date().toISOString()
  };

  const saved = await writeJsonFile("orders.json", [order, ...orders]);
  return Response.json(saved);
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as Order;

  if (!payload.id) {
    return jsonError("Order id is required.");
  }

  const orders = await readJsonFile<Order[]>("orders.json");
  const exists = orders.some((order) => order.id === payload.id);

  if (!exists) {
    return jsonError("Order not found.", 404);
  }

  const nextOrders = orders.map((order) =>
    order.id === payload.id
      ? {
          ...order,
          ...payload,
          quantity: Number(payload.quantity || 1),
          total: Number(payload.total || 0)
        }
      : order
  );

  const saved = await writeJsonFile("orders.json", nextOrders);
  return Response.json(saved);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return jsonError("Order id is required.");
  }

  const orders = await readJsonFile<Order[]>("orders.json");
  const saved = await writeJsonFile(
    "orders.json",
    orders.filter((order) => order.id !== id)
  );

  return Response.json(saved);
}