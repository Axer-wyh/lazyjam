import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export interface PaymentMethod {
  enabled: boolean;
  qrCode: string;
  accountName: string;
}

export interface PaymentConfig {
  wechat: PaymentMethod;
  alipay: PaymentMethod;
  bankCard: {
    enabled: boolean;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export async function GET() {
  const record = await prisma.paymentConfig.findUnique({
    where: { id: "payment" },
  });

  if (!record) {
    return Response.json({
      wechat: { enabled: false, qrCode: "", accountName: "" },
      alipay: { enabled: false, qrCode: "", accountName: "" },
      bankCard: { enabled: false, bankName: "", accountNumber: "", accountName: "" },
    });
  }

  return Response.json(record.config);
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  try {
    await prisma.paymentConfig.upsert({
      where: { id: "payment" },
      update: { config: payload },
      create: { id: "payment", config: payload },
    });
    return Response.json(payload);
  } catch {
    return jsonError("Failed to save payment config.", 500);
  }
}