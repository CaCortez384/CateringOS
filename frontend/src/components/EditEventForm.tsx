// frontend/src/components/EditEventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditEventForm({ event }: { event: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  // Estado inicial con los datos del evento actual
  const [formData, setFormData] = useState({
    name: event.name,
    guests: event.guests,
    date: new Date(event.date).toISOString().split('T')[0], // Formato YYYY-MM-DD para el input
    clientId: event.clientId
  });

  // Cargar clientes al abrir el modal (para poder cambiarlo si queremos)
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:4000/clients')
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(err => console.error("Error cargando clientes:", err));
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/events/${event.id}`, {
        method: 'PATCH', // <--- Importante: PATCH para actualizar
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          guests: Number(formData.guests),
          date: new Date(formData.date).toISOString(),
          clientId: Number(formData.clientId)
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      setIsOpen(false);
      router.refresh(); // Refresca la página para ver los cambios
      
    } catch (error) {
      alert('Falló la actualización');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* BOTÓN LÁPIZ (Disparador) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition"
        title="Editar Evento"
      >
        ✏️
      </button>

      {/* MODAL (Solo se ve si isOpen es true) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Editar Evento</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* SELECTOR DE CLIENTE */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Cliente</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                  value={formData.clientId}
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOMBRE EVENTO */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nombre Evento</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* INVITADOS Y FECHA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Invitados</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}