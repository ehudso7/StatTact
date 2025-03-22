"use client";

import { useEffect, useState } from "react";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from 'next/script';

// Font configuration
const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const monoFont = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Google Analytics tracking ID - create this file if it doesn't exist
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={isClient ? `${interFont.className} ${monoFont.className}` : ""}>
        {children}
      </body>
    </html>
  );
}
