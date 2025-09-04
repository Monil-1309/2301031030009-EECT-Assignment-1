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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PJ2Q8RPN');
            `,
          }}
        />
        <link rel="icon" href="/elixlifestyle.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PJ2Q8RPN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
