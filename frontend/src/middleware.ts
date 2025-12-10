// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Intentamos leer la cookie del token
  const token = request.cookies.get('auth_token')?.value;

  // 2. Definimos las rutas protegidas (Dashboard y Clientes)
  // Si NO tienes token y tratas de entrar a una ruta protegida -> Login
  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Si YA tienes token y tratas de ir al login -> Te mando al Dashboard
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configuración: Solo protegemos estas rutas (excluimos la API, imágenes y la página pública de cotización)
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas EXCEPTO:
     * - api (rutas API si las hubiera en frontend)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (icono)
     * - quote (¡IMPORTANTE! Las cotizaciones deben ser PÚBLICAS)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|quote).*)',
  ],
};