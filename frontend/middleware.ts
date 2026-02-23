import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Nota: El middleware se ejecuta en el servidor, no tiene acceso a localStorage
// La protección real se hace en el cliente con el AuthProvider
// Este middleware solo maneja redirecciones básicas

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isPublicPage = request.nextUrl.pathname === '/';

  // Las redirecciones basadas en autenticación se manejan en el cliente
  // Este middleware solo previene acceso directo a rutas protegidas
  // La lógica real está en cada página con useAuth()

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

