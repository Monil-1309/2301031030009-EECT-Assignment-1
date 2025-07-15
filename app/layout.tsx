import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElixLifestyle - Premium Fashion & Lifestyle Products",
  description:
    "Discover premium fashion and lifestyle products at ElixLifestyle. Quality clothing, accessories, and lifestyle items for modern living.",
  keywords: "fashion, lifestyle, clothing, premium, quality, modern",
  authors: [{ name: "ElixLifestyle" }],
  openGraph: {
    title: "ElixLifestyle - Premium Fashion & Lifestyle Products",
    description:
      "Discover premium fashion and lifestyle products at ElixLifestyle.",
    type: "website",
    locale: "en_US",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/elixlifestyle.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
