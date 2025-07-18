import type { Metadata } from "next";
import "./globals.css";
import AuthListener from "./auth";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthListener>
        <body>{children}</body>
      </AuthListener>
    </html>
  );
}
