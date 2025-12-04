// frontend/src/app/page.tsx
import CreateEventForm from '@/components/CreateEventForm';
import Link from 'next/link'; // <--- Importante para la navegación

async function getEvents() {
  const res = await fetch('http://localhost:4000/events', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}


export default async function Home() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO (Igual que antes) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
              🔥 CateringOS <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">Admin</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Gestiona tus eventos y cotizaciones</p>
          </div>
          <CreateEventForm /> 
        </div>

        {/* LISTA DE EVENTOS MEJORADA */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No hay eventos aún.</p>
          ) : (
            events.map((event: any) => (
              <div 
                key={event.id} 
                className={`bg-gray-800 p-6 rounded-xl border transition shadow-lg group ${
                  // Borde rojo si rechazado, verde si reservado
                  event.status === 'REJECTED' ? 'border-red-900/50 opacity-75' : 
                  event.status === 'BOOKED' ? 'border-green-900/50 hover:border-green-500' :
                  'border-gray-700 hover:border-orange-500/50'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{event.name}</h2>
                      {/* ETIQUETA DE ESTADO */}
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

                    {/* ¡AQUÍ ESTÁ LA CLAVE! Mostrar qué menú eligieron */}
                    {event.menu && (
                      <div className="mt-3 inline-block bg-gray-900/50 px-3 py-1 rounded text-sm text-orange-200 border border-orange-500/20">
                        🍖 Menú elegido: <strong className="text-orange-400">{event.menu.name}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/quote/${event.uuid}`} 
                      target="_blank"
                      className="text-gray-400 hover:text-white text-sm underline hover:no-underline"
                    >
                      Ver Link
                    </Link>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}