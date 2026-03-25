import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Do It — Goal Tracker",
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
      className={`${plusJakartaSans.variable} ${inter.variable} h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface font-body text-on-surface antialiased">
        <header className="w-full top-0 sticky z-50 bg-white border-b border-grey-blue font-headline antialiased tracking-tight">
          <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold tracking-tighter text-coral-accent">
                Do It
              </span>
              <nav className="hidden md:flex gap-6">
                <a
                  className="text-on-surface border-b-2 border-coral-accent pb-1 font-semibold transition-colors duration-200"
                  href="#"
                >
                  Dashboard
                </a>
                <a
                  className="text-on-surface-variant font-medium hover:text-coral-accent transition-colors duration-200"
                  href="#"
                >
                  Analytics
                </a>
                <a
                  className="text-on-surface-variant font-medium hover:text-coral-accent transition-colors duration-200"
                  href="#"
                >
                  Community
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-on-surface-variant hover:text-coral-accent transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-coral-accent transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-grey-blue-light flex items-center justify-center border border-grey-blue">
                <span className="material-symbols-outlined text-on-surface-variant">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-screen-2xl mx-auto px-8 py-12 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
