import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "do it — Goal Tracker",
  description: "Track your goals and get things done",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-pastel-cream">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            do it
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
