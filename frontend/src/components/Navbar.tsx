// frontend/src/components/Navbar.tsx
'use client'; // <--- Necesario para leer la URL

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();

  // LISTA NEGRA: Rutas donde NO queremos ver la barra
  // 1. /login (Pantalla de entrada)
  // 2. /quote/... (Lo que ve el cliente)
  if (pathname === '/login' || pathname.startsWith('/quote')) {
    return null; // No renderizamos nada
  }

  return (
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
            className={`hover:text-orange-400 transition flex items-center gap-2 ${
              pathname === '/' ? 'text-orange-500' : 'text-gray-300'
            }`}
          >
            📅 Eventos
          </Link>
          <Link 
            href="/clients" 
            className={`hover:text-orange-400 transition flex items-center gap-2 ${
              pathname === '/clients' ? 'text-orange-500' : 'text-gray-300'
            }`}
          >
            👥 Clientes
          </Link>
        </div>
      </div>
    </nav>
  );
}