import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { Toaster } from "sonner";
import CommandPalette from "@/components/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropChain — Real Estate NFT Dashboard",
  description:
    "A modern Web3 Real Estate NFT Dashboard with blockchain-powered property investments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-slate-800 bg-[#F8F9FB] dark:bg-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        <PreferencesProvider>
          <AuthProvider>
            {children}
            <CommandPalette />
            <Toaster position="bottom-right" richColors />
          </AuthProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
