import { NextRequest } from "next/server";
import { jsonError, readJsonFile, writeJsonFile } from "@/lib/data-store";
import type { Section } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const sections = await readJsonFile<Section[]>("sections.json");
  return Response.json(sections.sort((a, b) => a.order - b.order));
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as Section[];

  if (!Array.isArray(payload)) {
    return jsonError("Sections payload must be an array.");
  }

  const normalized = payload
    .map((section, index) => ({
      ...section,
      order: Number(section.order || index + 1),
      isActive: Boolean(section.isActive)
    }))
    .sort((a, b) => a.order - b.order);

  const saved = await writeJsonFile("sections.json", normalized);
  return Response.json(saved);
}
