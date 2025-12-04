import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- IMPORTANTE: Esto lo hace accesible en toda la app
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- Exportamos el servicio para que otros lo usen
})
export class PrismaModule {}