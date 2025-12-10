// frontend/src/components/CreateEventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config'; // <--- Importar arriba

export default function CreateEventForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lista de clientes existentes para el buscador/selector
  const [existingClients, setExistingClients] = useState<any[]>([]); 
  
  // Modo: ¿Eligiendo uno existente o creando uno nuevo?
  const [isNewClient, setIsNewClient] = useState(false);

  const [formData, setFormData] = useState({
    // Datos del Evento
    eventName: '',
    guests: '',
    date: '',
    
    // Datos del Cliente (Usados si es nuevo o existente)
    clientId: '',     // Para selección
    clientName: '',   // Para creación
    clientEmail: '',  // Para creación
    clientPhone: ''   // Para creación
  });

  // Cargar clientes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/clients`)
        .then(res => res.json())
        .then(data => setExistingClients(data))
        .catch(err => console.error("Error cargando clientes:", err));
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalClientId = formData.clientId;

      // PASO 1: Si es cliente nuevo, lo creamos primero
      if (isNewClient) {
        const resClient = await fetch(`${API_URL}/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.clientName,
            email: formData.clientEmail,
            phone: formData.clientPhone
          }),
        });

        if (!resClient.ok) throw new Error('Error creando cliente');
        
        const newClient = await resClient.json();
        finalClientId = newClient.id; // ¡Capturamos el ID recién creado!
      } else {
        // Validación para modo "Existente"
        if (!finalClientId) {
          alert("Debes seleccionar un cliente o crear uno nuevo.");
          setIsLoading(false);
          return;
        }
      }

      // PASO 2: Creamos el evento asociado a ese ID (viejo o nuevo)
      const resEvent = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.eventName,
          guests: Number(formData.guests),
          date: new Date(formData.date).toISOString(),
          clientId: Number(finalClientId)
        }),
      });

      if (!resEvent.ok) throw new Error('Error creando evento');

      // Éxito total
      setIsOpen(false);
      resetForm();
      router.refresh(); 
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      eventName: '', guests: '', date: '', 
      clientId: '', clientName: '', clientEmail: '', clientPhone: ''
    });
    setIsNewClient(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-orange-900/20"
      >
        + Nuevo Evento
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Agendar Evento</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* SECCIÓN CLIENTE */}
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-orange-400 text-sm font-semibold uppercase tracking-wider">
                    Datos del Cliente
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewClient(!isNewClient)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    {isNewClient ? "Seleccionar Existente" : "Crear Nuevo"}
                  </button>
                </div>

                {isNewClient ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text" 
                      required={isNewClient}
                      placeholder="Nombre Completo"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none"
                      value={formData.clientName}
                      onChange={e => setFormData({...formData, clientName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="email" 
                        placeholder="Email (Opcional)"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none"
                        value={formData.clientEmail}
                        onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                      />
                      <input 
                        type="tel" 
                        placeholder="Teléfono"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none"
                        value={formData.clientPhone}
                        onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none"
                    value={formData.clientId}
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">-- Buscar Cliente --</option>
                    {existingClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* SECCIÓN EVENTO */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nombre del Evento</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Cumpleaños de 50"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                  value={formData.eventName}
                  onChange={e => setFormData({...formData, eventName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Invitados (Pax)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-orange-500"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-orange-500"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Procesando...' : 'Crear Cotización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}