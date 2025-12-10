// frontend/src/config.ts

// Si existe una variable de entorno (en la nube), úsala. Si no, usa localhost.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';