import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PYUSD Recurring Scheduler",
  description:
    "Schedule recurring PYUSD transfers on Sepolia directly from your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-slate-950 text-slate-100 antialiased",
        ].join(" ")}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
