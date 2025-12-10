// backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Importante importar Prisma

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // <--- ¡EXPORTO EL SERVICIO PARA QUE OTROS LO USEN!
})
export class UsersModule {}