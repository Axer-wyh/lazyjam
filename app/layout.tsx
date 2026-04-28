import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LazyJam | 粘土手作与串珠首饰",
  description: "LazyJam 是一个粘土手作与串珠首饰品牌，关注 Wabi-sabi、亚麻质感和慢速制作。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
