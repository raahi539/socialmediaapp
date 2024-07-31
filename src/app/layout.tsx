"use client"
import "~/styles/globals.css";
import Sidebar from "./components/sidebar";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <SessionProvider>
        <body className="container mx-auto flex">
          <Sidebar />
          {children}
        </body>
        </SessionProvider>
    </html>
  );
}
