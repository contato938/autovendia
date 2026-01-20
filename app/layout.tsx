import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
  // Ler env vars em runtime (prioriza SUPABASE_URL/SUPABASE_ANON_KEY do servidor)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  // Não injeta se for placeholder (força client a usar stub)
  const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co') || supabaseAnonKey.includes('placeholder-anon-key');
  const supabaseEnv = isPlaceholder ? { url: '', anonKey: '' } : { url: supabaseUrl, anonKey: supabaseAnonKey };

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
