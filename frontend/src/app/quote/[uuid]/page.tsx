// frontend/src/app/quote/[uuid]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuotePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/events/uuid/${uuid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cotización no encontrada");
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleSelectMenu = async (menuId: number, menuName: string) => {
    if (!confirm(`¿Confirmas que deseas contratar la "${menuName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:4000/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId, status: "BOOKED" }),
      });
      if (!res.ok) throw new Error("Error al guardar");

      const updatedEvent = await res.json();
      setEvent(updatedEvent);
      setSuccessMsg(`¡Excelente! Has reservado la ${menuName}.`);
    } catch (err) {
      alert("Error al procesar la solicitud.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-2">
            Hola, {event.client?.name}
          </h1>
          <p className="text-gray-400 text-lg">
            Aquí tienes las propuestas para tu evento del{" "}
            <span className="text-white font-semibold">
              {new Date(event.date).toLocaleDateString()}
            </span>{" "}
            ({event.guests} personas)
          </p>
        </div>

        {/* ESTADO DE ÉXITO */}
        {event.menu || successMsg ? (
          <div className="max-w-2xl mx-auto bg-green-900/20 border border-green-500/30 p-10 rounded-3xl text-center shadow-2xl shadow-green-900/20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              ¡Todo Listo!
            </h2>
            <p className="text-xl text-gray-200">
              Has seleccionado:{" "}
              <strong className="text-white block mt-2 text-2xl">
                {event.menu?.name || "Tu Menú"}
              </strong>
            </p>
            <p className="mt-6 text-gray-400 text-sm">
              Nos pondremos en contacto contigo a la brevedad para coordinar el
              pago.
            </p>
          </div>
        ) : (
          /* GRILLA DE OPCIONES */
          <>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* OPCIÓN 1: FUEGO CRIOLLO */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-orange-500/30 transition duration-300 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-1">
                Fuego Criollo
              </h3>
              <p className="text-sm text-gray-400 mb-4 h-10">
                Opción directa y ajustada, manteniendo la calidad.
              </p>

              <div className="text-3xl font-bold text-white mb-1">
                $16.000{" "}
                <span className="text-sm text-gray-500 font-normal">/ p/p</span>
              </div>
              <div className="text-sm text-orange-400 mb-6 font-mono">
                Total estimado: $
                {(16000 * event.guests).toLocaleString("es-CL")}
              </div>

              <div className="space-y-4 text-sm text-gray-300 flex-1">
                <div>
                  <strong className="text-white block mb-1">
                    🔥 A las Brasas:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400">
                    <li>Punta de Ganso Premium</li>
                    <li>Costillar de Cerdo marinado</li>
                    <li>Muslos de Pollo al limón</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-white block mb-1">🌶 Delicias:</strong>
                  <p className="text-gray-400">
                    Pimientos rellenos y Zapallitos italianos.
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded text-xs text-gray-400 italic">
                  Incluye: 2 parrilleros, insumos y traslados.
                </div>
              </div>

              <button
                onClick={() => handleSelectMenu(1, "Experiencia Fuego Criollo")}
                className="mt-8 w-full py-3 border border-gray-600 hover:bg-gray-700 rounded-xl font-bold transition text-gray-200"
              >
                Seleccionar Criollo
              </button>
            </div>
            {/* OPCIÓN 2: FUEGO TOTAL (DESTACADA) */}
            <div className="bg-gray-800 border-2 border-orange-500 rounded-2xl p-6 relative shadow-2xl shadow-orange-900/20 transform lg:-translate-y-4 flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Más Vendido
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                Fuego Total
              </h3>
              <p className="text-sm text-gray-400 mb-4 h-10">
                El balance perfecto entre calidad y variedad.
              </p>

              <div className="text-3xl font-bold text-white mb-1">
                $21.000{" "}
                <span className="text-sm text-gray-500 font-normal">/ p/p</span>
              </div>
              <div className="text-sm text-orange-400 mb-6 font-mono">
                Total estimado: $
                {(21000 * event.guests).toLocaleString("es-CL")}
              </div>

              <div className="space-y-4 text-sm text-gray-300 flex-1">
                <div>
                  <strong className="text-orange-400 block mb-1">
                    🔥 Selección Brasas:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li className="font-semibold text-white">
                      Lomo Vetado Angus
                    </li>
                    <li>Punta de Ganso Premium</li>
                    <li>Costillar en salsa de la casa</li>
                    <li>Muslos de Pollo deshuesados</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-orange-400 block mb-1">
                    🌶 Cocktail Parrillero:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Pimientos con huevo/queso</li>
                    <li>Champiñones al ajillo</li>
                    <li>Zapallitos finas hierbas</li>
                  </ul>
                </div>
                <div className="bg-orange-900/20 p-3 rounded border border-orange-500/20 text-xs text-orange-200">
                  🎁 Plus: Tabla de bienvenida + Limpieza final de parrilla.
                </div>
              </div>

              <button
                onClick={() => handleSelectMenu(2, "Experiencia Fuego Total")}
                className="mt-8 w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition shadow-lg hover:shadow-orange-900/40"
              >
                ¡Elegir la Favorita!
              </button>
            </div>
            {/* OPCIÓN 3: FUEGO PREMIUM */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-500 transition duration-300 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-1">
                Fuego Premium
              </h3>
              <p className="text-sm text-gray-400 mb-4 h-10">
                La experiencia definitiva con buffet completo.
              </p>

              <div className="text-3xl font-bold text-white mb-1">
                $23.000{" "}
                <span className="text-sm text-gray-500 font-normal">/ p/p</span>
              </div>
              <div className="text-sm text-orange-400 mb-6 font-mono">
                Total estimado: $
                {(23000 * event.guests).toLocaleString("es-CL")}
              </div>

              <div className="space-y-4 text-sm text-gray-300 flex-1">
                <div>
                  <strong className="text-white block mb-1">
                    🔥 Carnes & Parrilla:
                  </strong>
                  <p className="text-xs text-gray-400 mb-2">
                    Incluye todo lo de la opción anterior (Lomo, Punta de Ganso,
                    etc.)
                  </p>
                </div>
                <div>
                  <strong className="text-white block mb-1">
                    🥗 Buffet Americano:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400">
                    <li>Ensalada chilena fresca</li>
                    <li>Arroz primavera</li>
                    <li>Papas mayo caseras</li>
                    <li>Fuentes de pebre cuchareado</li>
                  </ul>
                </div>
                <div className="bg-gray-700/30 p-3 rounded text-xs text-gray-400">
                  Incluye: Servicio completo 2 parrilleros.
                </div>
                <div className="text-xs text-gray-500 italic text-center pt-2">
                  * Opcional: Cordero al palo (+$190.000)
                </div>
              </div>

              <button
                onClick={() => handleSelectMenu(3, "Experiencia Fuego Premium")}
                className="mt-8 w-full py-3 border border-gray-600 hover:bg-gray-700 rounded-xl font-bold transition text-gray-200"
              >
                Seleccionar Premium
              </button>
            </div>

          </div>
          {/* --- AGREGAR ESTO: Botón de Rechazo --- */}
          <div className="mt-16 text-center border-t border-gray-800 pt-8">
             <p className="text-gray-500 mb-4 text-sm">¿Esta propuesta no se ajusta a lo que buscas?</p>
             <button 
               onClick={async () => {
                 if(!confirm('¿Seguro que deseas rechazar la propuesta? Esto notificará al equipo.')) return;
                 await fetch(`http://localhost:4000/events/${event.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'REJECTED' })
                 });
                 // Recargamos para mostrar mensaje
                 window.location.reload(); 
               }}
               className="text-gray-600 hover:text-red-400 text-sm font-medium transition flex items-center justify-center gap-2 mx-auto"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
               Rechazar Cotización
             </button>
             
             {/* Mensaje especial si está rechazado */}
             {event.status === 'REJECTED' && (
                <div className="mt-4 text-red-400 bg-red-900/10 p-4 rounded-lg">
                  Has rechazado esta propuesta. Nos pondremos en contacto para ver si podemos mejorarla.
                </div>
             )}
          </div>
          </>
        )}
      </div>
    </main>
  );
}
