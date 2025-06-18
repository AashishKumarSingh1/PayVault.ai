import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import { OfflinePaymentHandler } from "@/components/offlinePaymentHandler";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayVault.ai",
  description: "Created By Team Pheonix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <OfflinePaymentHandler />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 h-screen overflow-auto">
            <Topbar />
            <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
          </div>
        </div>
      </body>
    </html>
  );
}
