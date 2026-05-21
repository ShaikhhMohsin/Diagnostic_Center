import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// We'll use Inter for body text and Outfit for headings to give a modern, premium feel
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Multi Diagnostic Center – Trusted Diagnostics in Raichur",
  description: "NABL accredited healthcare diagnostics center in Gurugunta, Karnataka. Offering accurate blood tests, clinical wellness packages, and home sample collection across Lingasugur & Raichur district.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {/* Add padding top to account for fixed navbar */}
            <main className="flex-grow pt-20">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
