import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ErrorBoundary } from "@/components";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prueba Técnica Bx",
  description: "Vota por tu personaje favorito de Rick and Morty, Pokémon y Superheroes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
