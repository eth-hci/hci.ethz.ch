import type { Metadata } from "next";
import "./globals.css";
import { myCustomFont } from "./fonts"; // ✅ Import the custom font


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
      <body>{children}</body>
    </html>
  );
}
