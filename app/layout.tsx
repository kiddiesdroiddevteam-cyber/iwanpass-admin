import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { trap } from "@/fonts/trap";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iwanpass Admin",
  description: "Admin dashboard for iwanpass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${trap.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex justify-center bg-gray-100">
        <Providers>
          <div className="w-full max-w-[1440px] min-h-screen bg-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}