export class CreateEventDto {
  name: string;      // Ej: "Cumpleaños de la Tía"
  date: string;      // Ej: "2025-10-15T20:00:00Z" (Las fechas viajan como texto en JSON)
  guests: number;    // Ej: 50
  clientId: number;  // <--- LA CLAVE: El ID del cliente que paga
}