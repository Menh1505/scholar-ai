import type { Metadata } from "next";
import { Nunito_Sans, Nunito } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const nunitoMono = Nunito({
  variable: "--font-nunito-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scholar AI",
  description: "The helpful study abroad advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${nunitoMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
