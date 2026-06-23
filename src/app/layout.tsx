import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AssistantWidget } from "@/modules/assistant/components/AssistantWidget";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emil Conradsson — Front-end developer",
  description:
    "Front-end developer in Stockholm — React, Next.js, TypeScript, design systems, and UI/UX.",
  openGraph: {
    title: "Emil Conradsson — Front-end developer",
    description:
      "Front-end developer in Stockholm — React, Next.js, TypeScript, design systems, and UI/UX.",
    url: "https://emil-conradsson-portfolio-app.vercel.app",
    siteName: "Emil Conradsson",
    images: [
      {
        url: "https://emil-conradsson-portfolio-app.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emil Conradsson — Front-end developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emil Conradsson",
              jobTitle: "Front-end Developer",
              url: "https://emil-conradsson-portfolio-app.vercel.app/",
              email: "emil.conradsson1@gmail.com",
              sameAs: ["https://github.com/emiliocheval"],
            }),
          }}
        />
      </head>
      <body className="font-sans flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        {children}
        <AssistantWidget />
        <Analytics />
      </body>
    </html>
  );
}
