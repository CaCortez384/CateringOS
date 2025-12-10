// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config'; // <--- Importar arriba

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await res.json();
      
      // LA CLAVE DEL ÉXITO: Guardar el token en una Cookie
      // Esto permite que el Middleware (el guardia) lo lea después.
      document.cookie = `auth_token=${data.access_token}; path=/; max-age=43200; SameSite=Lax`;

      // Redirigir al Dashboard
      router.push('/');
      router.refresh(); // Para que el layout detecte el cambio si fuera necesario

    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">🔥 CateringOS</h1>
          <p className="text-gray-400 text-sm">Acceso Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition"
              placeholder="admin@sociosdelfuego.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          Solo personal autorizado de Socios del Fuego
        </div>
      </div>
    </main>
  );
}