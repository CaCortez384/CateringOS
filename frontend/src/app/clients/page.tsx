// frontend/src/app/clients/page.tsx
import Link from 'next/link';
import ClientRow from '@/components/ClientRow'; // <--- IMPORTAR

async function getClients() {
  // Recordar: nuestro backend incluye los eventos en el findAll de clients
  const res = await fetch('http://localhost:4000/clients', { cache: 'no-store' });
  if (!res.ok) throw new Error('Error cargando clientes');
  return res.json();
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* ... Header igual que antes ... */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Cartera de Clientes</h1>
            <p className="text-gray-400 text-sm mt-1">Personas que han cotizado o contratado</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Contacto</th>
                <th className="p-4 font-medium text-center">Eventos</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm text-gray-300">
              
              {/* AQUÍ ESTÁ EL CAMBIO: Usamos ClientRow */}
              {clients.map((client: any) => (
                <ClientRow key={client.id} client={client} />
              ))}
              
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}