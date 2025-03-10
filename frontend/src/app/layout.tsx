import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const soraFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: "variable",
});
const spaceGroteskFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: "variable",
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
        className={`${soraFont.variable} ${spaceGroteskFont.variable} antialiased bg-background text-gray-950 dark:bg-gray-950 dark:text-gray-300 font-body`}
      >
        {children}
      </body>
    </html>
  );
}
