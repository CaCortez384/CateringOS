// frontend/src/components/EventCard.tsx
'use client'; // <--- Esto habilita la interactividad

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventCard({ event }: { event: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para borrar el evento
  const handleDelete = async () => {
    // 1. Confirmación de seguridad
    if (!confirm('¿Estás SEGURO de eliminar este evento? No se puede deshacer.')) return;

    setIsDeleting(true);

    try {
      // 2. Llamada al Backend
      const res = await fetch(`http://localhost:4000/events/${event.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar');

      // 3. Recargar la página para ver el cambio
      router.refresh(); 
      
    } catch (error) {
      alert('Hubo un problema al intentar borrar.');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-xl border transition shadow-lg group relative ${
      event.status === 'REJECTED' ? 'border-red-900/50 opacity-75' : 
      event.status === 'BOOKED' ? 'border-green-900/50 hover:border-green-500' :
      'border-gray-700 hover:border-orange-500/50'
    } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* INFO DEL EVENTO */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-white">{event.name}</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
              event.status === 'BOOKED' ? 'bg-green-900 text-green-400 border border-green-700' : 
              event.status === 'REJECTED' ? 'bg-red-900 text-red-400 border border-red-700' :
              'bg-gray-700 text-gray-300'
            }`}>
              {event.status === 'BOOKED' ? 'Confirmado' : 
               event.status === 'REJECTED' ? 'Rechazado' : 'Borrador'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
            <span>👤 {event.client?.name}</span>
            <span>👥 {event.guests} pax</span>
          </div>

          {event.menu && (
            <div className="mt-3 inline-block bg-gray-900/50 px-3 py-1 rounded text-sm text-orange-200 border border-orange-500/20">
              🍖 Menú: <strong className="text-orange-400">{event.menu.name}</strong>
            </div>
          )}
        </div>

        {/* ACCIONES (Botones) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Botón Ver Link */}
          <Link 
            href={`/quote/${event.uuid}`} 
            target="_blank"
            className="flex-1 md:flex-none text-center bg-gray-700 hover:bg-orange-600 hover:text-white text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-600 hover:border-orange-500"
          >
            🔗 Link
          </Link>

          {/* Botón Eliminar (NUEVO) */}
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition"
            title="Eliminar evento"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}