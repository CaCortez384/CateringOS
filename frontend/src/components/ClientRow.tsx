// frontend/src/components/ClientRow.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditClientForm from './EditClientForm';
import { API_URL } from '@/config'; // Importar la URL base de la API

export default function ClientRow({ client }: { client: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Protección: No dejar borrar si tiene eventos (aunque el backend también proteja)
    if (client.events.length > 0) {
      alert("No puedes eliminar un cliente que tiene eventos asociados. Borra los eventos primero.");
      return;
    }

    if (!confirm(`¿Eliminar a ${client.name}?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/clients/${client.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      router.refresh(); 
    } catch (error) {
      alert('Error al eliminar (Revisa que no tenga datos vinculados)');
      setIsDeleting(false);
    }
  };

  return (
    <tr className={`hover:bg-gray-700/30 transition ${isDeleting ? 'opacity-50' : ''}`}>
      <td className="p-4 font-medium text-white">
        {client.name}
      </td>
      <td className="p-4">
        <div className="flex flex-col">
          <span className="text-white">{client.email || '-'}</span>
          <span className="text-xs text-gray-500">{client.phone || 'Sin teléfono'}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          client.events.length > 0 ? 'bg-orange-900/50 text-orange-400' : 'bg-gray-700 text-gray-500'
        }`}>
          {client.events.length}
        </span>
      </td>
      <td className="p-4 text-right">
        {/* Componente de Edición */}
        <EditClientForm client={client} />
        
        {/* Botón Borrar */}
        <button 
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-400 transition text-xs uppercase font-bold"
          title="Eliminar Cliente"
        >
          Borrar
        </button>
      </td>
    </tr>
  );
}