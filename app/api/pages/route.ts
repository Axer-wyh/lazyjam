import { NextRequest } from "next/server";
import { jsonError, readJsonFile, writeJsonFile } from "@/lib/data-store";
import type { SiteConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await readJsonFile<SiteConfig>("config.json");
  return Response.json(config);
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as SiteConfig;

  if (!payload.siteName || !Array.isArray(payload.pages)) {
    return jsonError("Invalid site config payload.");
  }

  const nextConfig: SiteConfig = {
    ...payload,
    pages: payload.pages.map((page) => ({
      ...page,
      updatedAt: new Date().toISOString()
    }))
  };

  const saved = await writeJsonFile("config.json", nextConfig);
  return Response.json(saved);
}
