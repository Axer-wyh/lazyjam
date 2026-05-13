import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
  });
  return Response.json(sections);
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  if (!Array.isArray(payload)) {
    return jsonError("Sections payload must be an array.");
  }

  for (const section of payload) {
    if (!section.id || !section.title) {
      return jsonError("Section id and title are required for each item.");
    }
  }

  // Upsert each section
  for (const section of payload) {
    await prisma.section.upsert({
      where: { id: section.id },
      update: {
        type: section.type,
        title: section.title,
        subtitle: section.subtitle || null,
        description: section.description || null,
        imageUrl: section.imageUrl || null,
        href: section.href || null,
        ctaLabel: section.ctaLabel || null,
        order: Number(section.order || 0),
        isActive: Boolean(section.isActive),
      },
      create: {
        id: section.id,
        type: section.type,
        title: section.title,
        subtitle: section.subtitle || null,
        description: section.description || null,
        imageUrl: section.imageUrl || null,
        href: section.href || null,
        ctaLabel: section.ctaLabel || null,
        order: Number(section.order || 0),
        isActive: Boolean(section.isActive),
      },
    });
  }

  const sections = await prisma.section.findMany({ orderBy: { order: "asc" } });
  return Response.json(sections);
}