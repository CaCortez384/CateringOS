// frontend/src/app/quote/[uuid]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/config'; // <--- Importar arriba

// 1. DEFINIMOS LOS DETALLES DE CADA MENÚ AQUÍ (Para usarlos en ambos modos)
const MENU_DATA: Record<number, any> = {
  1: {
    description: "Opción directa y ajustada, manteniendo la calidad.",
    features: [
      { title: "🔥 A las Brasas", items: ["Punta de Ganso Premium", "Costillar de Cerdo marinado", "Muslos de Pollo al limón"] },
      { title: "🌶 Delicias", items: ["Pimientos rellenos y Zapallitos"] }
    ]
  },
  2: {
    description: "El balance perfecto entre calidad y variedad.",
    features: [
      { title: "🔥 Selección Brasas", items: ["Lomo Vetado Angus", "Punta de Ganso Premium", "Costillar en salsa", "Muslos de Pollo"] },
      { title: "🌶 Cocktail Parrillero", items: ["Pimientos rellenos", "Champiñones al ajillo", "Zapallitos"] }
    ]
  },
  3: {
    description: "La experiencia definitiva con buffet completo.",
    features: [
      { title: "🔥 Selección Brasas", items: ["Lomo Vetado Angus", "Punta de Ganso Premium", "Costillar en salsa", "Muslos de Pollo"] },
      { title: "🥗 Buffet Americano", items: ["Ensalada chilena", "Arroz primavera", "Papas mayo", "Pebre cuchareado"] }
    ]
  }
};

export default function QuotePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/events/uuid/${uuid}`)
      .then(res => {
        if (!res.ok) throw new Error('Cotización no encontrada');
        return res.json();
      })
      .then(data => {
        setEvent(data);
        if (!data.menu) setIsChanging(true);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleSelectMenu = async (menuId: number, menuName: string) => {
    if (event.menu?.id === menuId) {
      setIsChanging(false);
      return;
    }
    if (!confirm(`¿Confirmas cambiar tu elección a "${menuName}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, status: 'BOOKED' })
      });
      if (!res.ok) throw new Error('Error al guardar');
      
      const updatedEvent = await res.json();
      setEvent(updatedEvent);
      setIsChanging(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      alert('Error al procesar la solicitud.');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">{error}</div>;

  const showSummary = event.menu && !isChanging;
  // Obtenemos los detalles del menú seleccionado (si existe)
  const selectedDetails = event.menu ? MENU_DATA[event.menu.id] : null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-2">
            Hola, {event.client?.name}
          </h1>
          <p className="text-gray-400 text-lg">
            Aquí tienes las propuestas para tu evento del <span className="text-white font-semibold">{new Date(event.date).toLocaleDateString()}</span> ({event.guests} personas)
          </p>
        </div>

        {/* --- MODO RESUMEN (YA ELIGIÓ) --- */}
        {showSummary ? (
          <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
            <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-3xl text-center shadow-2xl shadow-green-900/20 relative overflow-hidden">
              
              <div className="relative z-10">
                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                  Opción Confirmada
                </span>
                <h2 className="text-4xl font-bold text-white mb-2">{event.menu.name}</h2>
                <p className="text-xl text-green-200 mb-8">
                  ¡Excelente elección! Todo está listo para procesar tu reserva.
                </p>

                {/* AQUÍ AGREGAMOS LA TARJETA DE DETALLES DEL SERVICIO */}
                {selectedDetails && (
                  <div className="bg-black/40 p-6 md:p-8 rounded-2xl border border-green-500/20 mb-8 text-left max-w-xl mx-auto">
                    <h3 className="text-green-400 font-bold mb-4 text-center uppercase text-sm tracking-widest border-b border-green-500/20 pb-2">
                      Lo que incluye tu experiencia
                    </h3>
                    <div className="space-y-6">
                      {selectedDetails.features.map((section: any, idx: number) => (
                        <div key={idx}>
                          <strong className="text-green-300 block mb-1 text-lg">{section.title}</strong>
                          <ul className="list-disc pl-5 space-y-1 text-gray-300">
                            {section.items.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precios y Totales */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 mb-8 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Valor p/p:</span>
                    <span className="text-white font-mono">${event.menu.basePrice.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-2 mt-2">
                    <span className="text-orange-400">Total Estimado:</span>
                    <span className="text-white font-mono">${(event.menu.basePrice * event.guests).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center">
                  <button 
                    onClick={() => setIsChanging(true)}
                    className="text-white bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
                  >
                    🔄 Cambiar mi elección
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* --- MODO SELECCIÓN (GRILLA) --- */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {event.menu && (
              <div className="text-center mb-8">
                <button 
                  onClick={() => setIsChanging(false)}
                  className="text-gray-500 hover:text-white mb-4 text-sm underline"
                >
                  ← Cancelar y mantener mi elección actual
                </button>
                <h2 className="text-2xl font-bold text-white">Selecciona tu nueva preferencia:</h2>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {[1, 2, 3].map((id) => (
                <MenuCard 
                  key={id}
                  id={id}
                  // Usamos los títulos "oficiales" que sembraste en la BD (o defaults)
                  // Aquí uso labels fijos para matchear tu diseño, pero podríamos sacarlos de MENU_DATA si quisieras
                  title={id === 1 ? "Fuego Criollo" : id === 2 ? "Fuego Total" : "Fuego Premium"}
                  price={id === 1 ? 16000 : id === 2 ? 21000 : 23000}
                  guests={event.guests}
                  description={MENU_DATA[id].description}
                  features={MENU_DATA[id].features}
                  isPopular={id === 2}
                  currentMenuId={event.menu?.id}
                  onSelect={handleSelectMenu}
                />
              ))}
            </div>

            <div className="mt-16 text-center border-t border-gray-800 pt-8 opacity-60 hover:opacity-100 transition">
              <button 
                 onClick={async () => {
                   if(!confirm('¿Seguro que deseas rechazar la propuesta?')) return;
                   await fetch(`${API_URL}/events/${event.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'REJECTED' })
                   });
                   window.location.reload(); 
                 }}
                 className="text-gray-500 hover:text-red-400 text-sm flex items-center justify-center gap-2 mx-auto"
               >
                 Rechazar Propuesta
               </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

function MenuCard({ id, title, price, guests, description, isPopular, currentMenuId, onSelect, features }: any) {
  const isSelected = currentMenuId === id;

  return (
    <div className={`
      relative p-6 rounded-2xl flex flex-col h-full transition duration-300
      ${isSelected 
        ? 'bg-green-900/20 border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-105 z-10' 
        : 'bg-gray-800 border border-gray-700 hover:border-orange-500/50'
      }
      ${isPopular && !isSelected ? 'border-orange-500 border-2 shadow-2xl shadow-orange-900/20 lg:-translate-y-4' : ''}
    `}>
      {isSelected && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
          ✅ Tu Selección Actual
        </div>
      )}
      {isPopular && !isSelected && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
          Más Vendido
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-4 h-10">{description}</p>
      
      <div className="text-3xl font-bold text-white mb-1">${price.toLocaleString('es-CL')} <span className="text-sm text-gray-500 font-normal">/ p/p</span></div>
      <div className="text-sm text-orange-400 mb-6 font-mono">Total estimado: ${(price * guests).toLocaleString('es-CL')}</div>

      <div className="space-y-4 text-sm text-gray-300 flex-1">
        {features.map((section: any, idx: number) => (
          <div key={idx}>
            <strong className={`${isSelected ? 'text-green-400' : 'text-orange-400'} block mb-1`}>{section.title}:</strong>
            <ul className="list-disc pl-4 space-y-1 text-gray-400">
              {section.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSelect(id, title)}
        disabled={isSelected}
        className={`mt-8 w-full py-3 rounded-xl font-bold transition ${
          isSelected 
          ? 'bg-green-600/20 text-green-500 cursor-default border border-green-500/50'
          : isPopular 
            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg'
            : 'border border-gray-600 hover:bg-gray-700 text-gray-200'
        }`}
      >
        {isSelected ? 'Seleccionado' : `Elegir ${title}`}
      </button>
    </div>
  );
}