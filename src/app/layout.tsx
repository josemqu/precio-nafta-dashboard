import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

// Configuración de fuentes
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Precio Nafta',
  description: 'Monitoreo de precios de combustibles en Argentina',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <SonnerToaster position="top-right" richColors closeButton />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
