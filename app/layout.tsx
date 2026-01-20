import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const dynamic = "force-dynamic";

// Inter (fonte principal) - Regular/Medium/SemiBold/Bold
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  fallback: ["Arial", "Helvetica", "Roboto", "system-ui", "sans-serif"],
});

// Space Grotesk (uso pontual) - KPIs/números/chamadas
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  fallback: ["Arial", "Helvetica", "Roboto", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "AUTOVEND IA",
  description: "SaaS de Automação de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseEnv = {
    // Prioriza variáveis "server/runtime" (não NEXT_PUBLIC) para evitar valores embutidos no build.
    // Em produção via Docker/Dokploy, configure SUPABASE_URL / SUPABASE_ANON_KEY (ou NEXT_PUBLIC_*).
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          id="supabase-env"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_ENV__ = ${JSON.stringify(supabaseEnv)};`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
