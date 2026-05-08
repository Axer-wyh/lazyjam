import { NextRequest } from "next/server";
import { jsonError, readJsonFile, writeJsonFile } from "@/lib/data-store";

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
  try {
    const config = await readJsonFile<PaymentConfig>("payments.json");
    return Response.json(config);
  } catch {
    return Response.json({
      wechat: { enabled: false, qrCode: "", accountName: "" },
      alipay: { enabled: false, qrCode: "", accountName: "" },
      bankCard: { enabled: false, bankName: "", accountNumber: "", accountName: "" },
    });
  }
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as PaymentConfig;

  try {
    const saved = await writeJsonFile("payments.json", payload);
    return Response.json(saved);
  } catch {
    return jsonError("Failed to save payment config.", 500);
  }
}