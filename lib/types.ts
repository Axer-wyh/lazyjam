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
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  materials: string[];
  inventory: number;
  featured: boolean;
  status: "draft" | "active" | "sold_out";
  stockTag: "Small Batch" | "Made to Order" | "One of a Kind" | "Sold Out";
  cycle: string;
  material: string;
  size: string;
  care: string;
  note: string;
  tags: string[];
  createdAt: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  shipping: string;
  payment: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  status: "pending" | "paid" | "making" | "shipped" | "completed" | "cancelled" | "refunded";
  note: string;
  createdAt: string;
};

export type AdminPage = {
  id: number;
  name: string;
  path: string;
  status: "draft" | "published";
  updated: string;
};

export type AdminSection = {
  id: number;
  name: string;
  image: string;
  url: string;
  order: number;
  status: "active" | "hidden";
};
