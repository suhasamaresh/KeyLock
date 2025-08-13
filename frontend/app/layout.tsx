import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import CustomCursor from "./components/customcursor";
import { Oxanium, Merriweather } from "next/font/google";
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-fira-code", 
});


const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "700"], 
  variable: "--font-oxanium", 
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"], 
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyLock",
  description: "Securely share your secrets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomCursor stroke="#0EA5E9" bgcolor="#0EA5E9" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
