// frontend/src/app/page.tsx
import CreateEventForm from '@/components/CreateEventForm'; // <--- IMPORTAR

async function getEvents() {
  const res = await fetch('http://localhost:4000/events', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">
            🔥 CateringOS <span className="text-gray-500 text-sm">by TuNombre</span>
          </h1>
          
          {/* AQUI ESTÁ EL CAMBIO: Usamos el componente interactivo */}
          <CreateEventForm /> 
          
        </div>

        {/* LISTA DE EVENTOS (Igual que antes) */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <p className="text-gray-400">No hay eventos agendados aún.</p>
          ) : (
            events.map((event: any) => (
              <div 
                key={event.id} 
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{event.name}</h2>
                    <p className="text-gray-400 text-sm mb-4">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                      <span>👤 {event.client?.name || 'Cliente Desconocido'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-white">
                      {event.guests} pax
                    </span>
                    <span className="bg-yellow-900 text-yellow-500 text-xs font-bold px-2 py-1 rounded uppercase">
                      {event.status}
                    </span>
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