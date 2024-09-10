import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flux Wallpaper Generator",
  description: "Generate Flux Wallpaper with AI",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}