// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    
    // Si no existe el usuario o la contraseña no coincide...
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si todo ok, generamos el "Pase VIP" (Token)
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { name: user.name, email: user.email } // Devolvemos datos básicos
    };
  }
}