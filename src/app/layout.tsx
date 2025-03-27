import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import Header from "@/components/shared/Header";
import { Toaster } from "@/components/ui/sonner";
// import Sidebar from "@/components/shared/Sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Thanksgiving",
  description: "Share your gratitude with the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-white">
        <NextTopLoader />
        <Toaster expand position="top-right" richColors />
        <Header />
        <div className="flex min-h-screen pt-14">
          {/* <Sidebar /> */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
