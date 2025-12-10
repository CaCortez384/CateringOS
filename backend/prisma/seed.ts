// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // <--- ¡AGREGA ESTA LÍNEA AQUÍ ARRIBA!

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando menús oficiales de Socios del Fuego...');

  // OPCIÓN 1: La Ajustada
  const menu1 = await prisma.menu.upsert({
    where: { id: 1 },
    update: {
      name: 'Experiencia Fuego Criollo',
      basePrice: 16000,
      description: 'Punta de Ganso, Costillar y Pollo. Calidad ajustada.',
    },
    create: {
      name: 'Experiencia Fuego Criollo',
      basePrice: 16000,
      description: 'Punta de Ganso, Costillar y Pollo. Calidad ajustada.',
    },
  });

  // OPCIÓN 2: La Favorita (Equilibrada)
  const menu2 = await prisma.menu.upsert({
    where: { id: 2 },
    update: {
      name: 'Experiencia Fuego Total',
      basePrice: 21000,
      description: 'Lomo Vetado, Punta de Ganso y variedad de picoteos.',
    },
    create: {
      name: 'Experiencia Fuego Total',
      basePrice: 21000,
      description: 'Lomo Vetado, Punta de Ganso y variedad de picoteos.',
    },
  });

  // OPCIÓN 3: La Premium (Con Buffet)
  const menu3 = await prisma.menu.upsert({
    where: { id: 3 },
    update: {
      name: 'Experiencia Fuego Premium',
      basePrice: 23000,
      description: 'La experiencia definitiva con buffet americano completo.',
    },
    create: {
      name: 'Experiencia Fuego Premium',
      basePrice: 23000,
      description: 'La experiencia definitiva con buffet americano completo.',
    },
  });

  // 0. Crear el Usuario Admin
  const password = await bcrypt.hash('admin123', 10); // Contraseña inicial: admin123
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sociosdelfuego.cl' },
    update: {}, // Si existe, no hacemos nada
    create: {
      email: 'admin@sociosdelfuego.cl',
      name: 'Admin Socios',
      password: password,
    },
  });
  console.log(`👤 Admin creado: ${admin.email}`);

  console.log('✅ Menús actualizados:');
  console.log(`1. ${menu1.name} ($${menu1.basePrice})`);
  console.log(`2. ${menu2.name} ($${menu2.basePrice})`);
  console.log(`3. ${menu3.name} ($${menu3.basePrice})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
