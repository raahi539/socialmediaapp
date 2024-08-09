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
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
          <title>TrueKonnekt</title>
        </head>
        <body className="container w-screen flex">
          <Sidebar />
          {children}
        </body>
        </SessionProvider>
    </html>
  );
}
