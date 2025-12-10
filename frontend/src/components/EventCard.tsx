// frontend/src/components/EventCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditEventForm from './EditEventForm';
import { API_URL } from '@/config'; // <--- Importar arriba

export default function EventCard({ event }: { event: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // --- LÓGICA WHATSAPP ROBUSTA ---
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : `${API_URL}`;
  const quoteUrl = `${baseUrl}/quote/${event.uuid}`;
  
  const message = `Hola ${event.client?.name || ''}, aquí tienes la cotización para tu evento "${event.name}". 
Puedes revisarla y confirmar tu menú aquí: ${quoteUrl}`;

  // Lógica: Si hay teléfono, usamos el link directo. Si no, usamos el link de compartir general.
  // Nota: Limpiamos el teléfono de espacios o guiones para evitar errores.
  const cleanPhone = event.client?.phone ? event.client.phone.replace(/\D/g, '') : '';
  
  // Usamos 'api.whatsapp.com/send' que es más estándar que 'wa.me'
  let whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  if (cleanPhone) {
    whatsappLink += `&phone=${cleanPhone}`;
  }
  // -----------------------

  const handleDelete = async () => {
    if (!confirm('¿Estás SEGURO de eliminar este evento? No se puede deshacer.')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
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

        {/* ACCIONES */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          {/* BOTÓN WHATSAPP */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none text-center bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-green-900/20"
            title={cleanPhone ? `Enviar a ${cleanPhone}` : "Seleccionar contacto en WhatsApp"}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.694c1.003.572 1.943.869 3.259.87 3.197 0 5.766-2.586 5.766-5.766.001-3.203-2.678-5.895-6.219-6.055zm3.892 7.767c-.215.528-1.03.924-1.422.958-.402.035-.785.074-2.882-.854-1.782-.789-2.906-2.73-3.016-2.876-.099-.134-.692-.958-.692-1.802 0-.853.447-1.272.607-1.442.159-.17.371-.214.53-.214.159 0 .318.007.456.02.148.014.34.022.508.471.19.498.669 1.636.732 1.761.063.124.106.273.016.435-.084.151-.137.246-.264.385-.148.148-.307.318-.423.445-.148.148-.285.328-.138.604.148.275.647 1.139 1.453 1.838 1.049.913 1.898 1.194 2.195 1.321.286.137.456.116.626-.064.169-.19.699-.813.88-1.092.179-.27.37-.225.625-.137.254.088 1.631.771 1.917.914.286.138.477.214.54.321.063.107.063.635-.152 1.163z"/>
            </svg>
            Enviar
          </a>

          {/* Botón Link */}
          <Link 
            href={`/quote/${event.uuid}`} 
            target="_blank"
            className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg transition border border-gray-600"
          >
            🔗
          </Link>

          {/* EDITAR */}
          <EditEventForm event={event} />

          {/* ELIMINAR */}
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}