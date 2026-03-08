import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS Battle Arena — Track, Compete, Conquer",
  description: "Track IELTS practice results, compete with friends, and conquer your target band score. A competitive IELTS preparation tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
