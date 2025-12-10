// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- Importamos el componente nuevo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CateringOS",
  description: "Sistema de gestión para Socios del Fuego",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* El Navbar decide solo si se muestra o no */}
        <Navbar />

        {/* Contenido de la página */}
        {children}
        
      </body>
    </html>
  );
}