import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบจัดการเวร",
  description: "ระบบจัดการเวร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-yH1KD6DCr4kYvNULmKMluSleqU9jwELyhl725LLJoPLD114F8nGMD4PlzyBbs6K8ZZrVSu2Mz/C2N2CqBX2p5Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 min-h-screen` }
      >
        {children}
      </body>
    </html>
  );
}
