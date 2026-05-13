import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [siteConfig, pages] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "config" } }),
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
  ]);

  return Response.json({
    siteName: siteConfig?.siteName || "LazyJam",
    tagline: siteConfig?.tagline || null,
    announcement: siteConfig?.announcement || null,
    contactEmail: siteConfig?.contactEmail || null,
    instagram: siteConfig?.instagram || null,
    pages,
  });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();

  if (!payload.siteName || !Array.isArray(payload.pages)) {
    return jsonError("Invalid site config payload.");
  }

  // Upsert site config
  await prisma.siteConfig.upsert({
    where: { id: "config" },
    update: {
      siteName: payload.siteName,
      tagline: payload.tagline || null,
      announcement: payload.announcement || null,
      contactEmail: payload.contactEmail || null,
      instagram: payload.instagram || null,
    },
    create: {
      id: "config",
      siteName: payload.siteName,
      tagline: payload.tagline || null,
      announcement: payload.announcement || null,
      contactEmail: payload.contactEmail || null,
      instagram: payload.instagram || null,
    },
  });

  // Upsert pages
  for (const page of payload.pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        eyebrow: page.eyebrow || null,
        description: page.description || null,
        status: page.status || "published",
      },
      create: {
        slug: page.slug,
        title: page.title,
        eyebrow: page.eyebrow || null,
        description: page.description || null,
        status: page.status || "published",
      },
    });
  }

  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return Response.json({ ...payload, pages });
}