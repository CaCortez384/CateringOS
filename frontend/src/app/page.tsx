// frontend/src/app/page.tsx
import CreateEventForm from '@/components/CreateEventForm';
import EventCard from '@/components/EventCard'; // <--- Importamos el componente
import { API_URL } from '@/config'; // <--- Importar arriba

async function getEvents() {
  const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
              🔥 CateringOS <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">Admin</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Gestiona tus eventos y cotizaciones</p>
          </div>
          <CreateEventForm /> 
        </div>

        {/* LISTA DE EVENTOS */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
              <p className="text-gray-400 text-lg">No hay eventos agendados aún.</p>
              <p className="text-gray-600 text-sm">Crea el primero arriba a la derecha.</p>
            </div>
          ) : (
            // AQUI ESTÁ EL CAMBIO: Usamos el componente EventCard
            events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}