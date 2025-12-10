// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que uses
import "./globals.css";
import Link from "next/link"; // <--- Importamos Link

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
        
        {/* --- NAVBAR GLOBAL --- */}
        <nav className="bg-gray-800 border-b border-gray-700 text-white">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="font-bold text-xl text-orange-500 flex items-center gap-2">
              🔥 CateringOS
            </div>

            {/* Links de Navegación */}
            <div className="flex gap-6 text-sm font-medium">
              <Link 
                href="/" 
                className="hover:text-orange-400 transition flex items-center gap-2"
              >
                📅 Eventos
              </Link>
              <Link 
                href="/clients" 
                className="hover:text-orange-400 transition flex items-center gap-2"
              >
                👥 Clientes
              </Link>
            </div>
          </div>
        </nav>
        {/* --------------------- */}

        {/* Contenido de cada página */}
        {children}
        
      </body>
    </html>
  );
}