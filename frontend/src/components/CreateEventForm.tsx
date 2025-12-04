// frontend/src/components/CreateEventForm.tsx
'use client'; // <--- ESTO ES OBLIGATORIO PARA USAR HOOKS

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    guests: '',
    date: '',
    clientId: '1' // Hardcodeado por ahora (Asumimos que es Juan Perez)
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          guests: Number(formData.guests), // Convertir a número
          date: new Date(formData.date).toISOString(), // Formato ISO
          clientId: Number(formData.clientId)
        }),
      });

      if (!res.ok) throw new Error('Error al crear');

      // Éxito: Limpiar y cerrar
      setFormData({ name: '', guests: '', date: '', clientId: '1' });
      setIsOpen(false);
      
      // Truco Pro: Refresca la data de la página sin recargar el navegador
      router.refresh(); 
      
    } catch (error) {
      alert('Falló la creación del evento');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        + Nuevo Evento
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Agendar Evento</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nombre Evento</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-orange-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Matrimonio Civil"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Invitados</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none"
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
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded transition disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}