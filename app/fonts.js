import localFont from "next/font/local";

// ✅ Define Custom Font
export const myCustomFont = localFont({
  src: [
    {
      path: "./fonts/DINNextW1G-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DINNextW1G-Bold.otf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-custom", // ✅ Defines a CSS variable
  display: "swap"
});
