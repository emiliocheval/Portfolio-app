import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AssistantWidget } from "@/modules/assistant/components/AssistantWidget";

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
      <body className="font-sans flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        {children}
        <AssistantWidget />
      </body>
    </html>
  );
}
