// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_SUPER_SECRETA_CAMBIAME', // <--- CAMBIAR EN PROD
      signOptions: { expiresIn: '12h' }, // El token dura 12 horas
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}