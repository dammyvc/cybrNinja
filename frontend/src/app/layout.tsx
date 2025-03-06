import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";

const inter = Inter({
  variable: "--font-int",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "CybrNinja",
  description: "Master the art of cyber security",
  icons: {
    icon: "/web_icon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      

      <body
        className={`${inter.variable} font-int antialiased w-full min-h-screen relative overflow-x-hidden bg-[rgba(249,252,255,1)] dark:bg-[rgba(0,0,0,0.5)]`}
      >
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
