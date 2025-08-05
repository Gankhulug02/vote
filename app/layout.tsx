import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { auth } from "@/auth";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font display
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font display
});

export const metadata: Metadata = {
  title: "YoutubeChamp - Vote for Your Favorite YouTubers",
  description: "Support the content creators you love. One vote, one voice.",
  keywords: ["YouTube", "voting", "creators", "content creators"],
  authors: [{ name: "YoutubeChamp Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <Header session={session} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
