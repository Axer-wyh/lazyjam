export type PageConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  updatedAt: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  announcement: string;
  contactEmail: string;
  instagram: string;
  pages: PageConfig[];
};

export type Section = {
  id: string;
  type: "hero" | "featured" | "craft" | "journal" | "cta";
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  href: string;
  ctaLabel: string;
  order: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: "clay" | "beads" | "mixed";
  price: number;
  imageUrl: string;
  description: string;
  materials: string[];
  inventory: number;
  featured: boolean;
  status: "draft" | "active" | "sold_out";
  createdAt: string;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  status: "pending" | "paid" | "making" | "shipped" | "completed" | "cancelled";
  note: string;
  createdAt: string;
};
