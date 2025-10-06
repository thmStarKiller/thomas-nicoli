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

const siteUrl = process.env.SITE_URL || 'https://thomas-nicoli.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thomas Nicoli - AI Consulting & Web Development",
    template: "%s | Thomas Nicoli"
  },
  description: "AI consulting and web development for commerce that actually ships. Expert AI solutions, custom web development, and digital transformation services.",
  keywords: ["AI consulting", "web development", "AI solutions", "digital transformation", "ecommerce", "artificial intelligence", "machine learning", "custom software", "Thomas Nicoli"],
  authors: [{ name: "Thomas Nicoli" }, { name: "Virginia Nicoli" }],
  creator: "Thomas Nicoli",
  publisher: "Thomas Nicoli",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: siteUrl,
    title: "Thomas Nicoli - AI Consulting & Web Development",
    description: "AI consulting and web development for commerce that actually ships. Expert AI solutions, custom web development, and digital transformation services.",
    siteName: "Thomas Nicoli",
    images: [
      {
        url: `${siteUrl}/images/placeholders/og-default.svg`,
        width: 1200,
        height: 630,
        alt: "Thomas Nicoli - AI Consulting & Web Development",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thomas Nicoli - AI Consulting & Web Development",
    description: "AI consulting and web development for commerce that actually ships.",
    images: [`${siteUrl}/images/placeholders/og-default.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'es': `${siteUrl}/es`,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-57HZSFXQ';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
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
