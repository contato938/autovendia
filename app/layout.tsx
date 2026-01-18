import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

// Montserrat para títulos - SemiBold (600) e Bold (700)
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
});

// Inter para texto corrido - Regular (400) e Medium (500)
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AutovendaIA",
  description: "SaaS de Automação de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
