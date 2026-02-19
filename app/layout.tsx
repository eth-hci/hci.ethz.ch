import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { myCustomFont } from "./fonts"; // ✅ Import the custom font

const GA_MEASUREMENT_ID = "G-WGKJS3BQ27";

export const metadata: Metadata = {
  title: "ETH Zurich HCI",
  description: "Human-Computer Interaction at ETH Zurich",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={myCustomFont.variable} suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
