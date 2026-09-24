import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnX - AI-Powered Learning Platform",
  description:
    "LearnX is an intelligent learning platform with instant video search to the exact second in every lesson.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFC] text-[#0F172A]">
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <SanityLive />
      </body>
    </html>
  );
}