import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Thomas Nicoli - AI Consulting",
  description: "AI consulting for commerce that actually ships.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Keep a stable, accurate viewport height for Nexus components */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const setVH = () => {
    try {
      const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      document.documentElement.style.setProperty('--nexus-vh', vh + 'px');
    } catch {}
  };
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  window.addEventListener('orientationchange', setVH);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setVH, { passive: true });
  }
})();`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
