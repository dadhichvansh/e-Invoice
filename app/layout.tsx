import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'e-Invoice',
  description: 'Create and manage electronic invoices with ease.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Toaster position="top-right" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
