import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting data migration...");

  // Migrate products
  console.log("Migrating products...");
  const products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        description: p.description || null,
        materials: p.materials || [],
        inventory: p.inventory ?? 0,
        featured: p.featured ?? false,
        status: p.status || "active",
        stockTag: p.stockTag || null,
        cycle: p.cycle || null,
        material: p.material || null,
        size: p.size || null,
        care: p.care || null,
        note: p.note || null,
        tags: p.tags || [],
      },
      create: {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        description: p.description || null,
        materials: p.materials || [],
        inventory: p.inventory ?? 0,
        featured: p.featured ?? false,
        status: p.status || "active",
        stockTag: p.stockTag || null,
        cycle: p.cycle || null,
        material: p.material || null,
        size: p.size || null,
        care: p.care || null,
        note: p.note || null,
        tags: p.tags || [],
      },
    });
  }
  console.log(`Migrated ${products.length} products`);

  // Migrate sections
  console.log("Migrating sections...");
  const sections = JSON.parse(fs.readFileSync("data/sections.json", "utf8"));
  for (const s of sections) {
    await prisma.section.upsert({
      where: { id: s.id },
      update: {
        type: s.type,
        title: s.title,
        subtitle: s.subtitle || null,
        description: s.description || null,
        imageUrl: s.imageUrl || null,
        href: s.href || null,
        ctaLabel: s.ctaLabel || null,
        order: s.order ?? 0,
        isActive: s.isActive ?? true,
      },
      create: {
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle || null,
        description: s.description || null,
        imageUrl: s.imageUrl || null,
        href: s.href || null,
        ctaLabel: s.ctaLabel || null,
        order: s.order ?? 0,
        isActive: s.isActive ?? true,
      },
    });
  }
  console.log(`Migrated ${sections.length} sections`);

  // Migrate orders
  console.log("Migrating orders...");
  const orders = JSON.parse(fs.readFileSync("data/orders.json", "utf8"));
  for (const o of orders) {
    await prisma.order.upsert({
      where: { id: o.id },
      update: {
        customer: o.customer,
        total: o.total,
        status: o.status || "pending",
        items: o.items,
        shipping: o.shipping || null,
        payment: o.payment || null,
      },
      create: {
        id: o.id,
        customer: o.customer,
        total: o.total,
        status: o.status || "pending",
        items: o.items,
        shipping: o.shipping || null,
        payment: o.payment || null,
      },
    });
  }
  console.log(`Migrated ${orders.length} orders`);

  // Migrate config
  console.log("Migrating site config...");
  const config = JSON.parse(fs.readFileSync("data/config.json", "utf8"));
  await prisma.siteConfig.upsert({
    where: { id: "config" },
    update: {
      siteName: config.siteName || "LazyJam",
      tagline: config.tagline || null,
      announcement: config.announcement || null,
      contactEmail: config.contactEmail || null,
      instagram: config.instagram || null,
    },
    create: {
      id: "config",
      siteName: config.siteName || "LazyJam",
      tagline: config.tagline || null,
      announcement: config.announcement || null,
      contactEmail: config.contactEmail || null,
      instagram: config.instagram || null,
    },
  });
  console.log("Migrated site config");

  // Migrate pages
  console.log("Migrating pages...");
  const pages = config.pages || [];
  for (const pg of pages) {
    await prisma.page.upsert({
      where: { slug: pg.slug },
      update: {
        title: pg.title,
        eyebrow: pg.eyebrow || null,
        description: pg.description || null,
        status: pg.status || "published",
      },
      create: {
        slug: pg.slug,
        title: pg.title,
        eyebrow: pg.eyebrow || null,
        description: pg.description || null,
        status: pg.status || "published",
      },
    });
  }
  console.log(`Migrated ${pages.length} pages`);

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });