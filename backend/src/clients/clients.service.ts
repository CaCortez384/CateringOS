import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate que la ruta sea correcta

@Injectable()
export class ClientsService {
  // 1. Inyección de Dependencias: "Nest, dame acceso a la BD"
  constructor(private prisma: PrismaService) {}

  // Crear Cliente
  async create(createClientDto: CreateClientDto) {
    return await this.prisma.client.create({
      data: createClientDto,
    });
  }

  // Obtener todos los clientes
  async findAll() {
    return await this.prisma.client.findMany({
      include: { events: true }, // <--- Truco Pro: Trae también sus eventos asociados
    });
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateClientDto: any) {
    return await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  // CAMBIO 2: Remove Real
  async remove(id: number) {
    // Opcional: Podrías validar si tiene eventos antes de borrar para no romper nada,
    // pero por ahora dejaremos que Prisma lance error si hay restricción de clave foránea,
    // o borraremos en cascada según tengas configurado el Schema.
    try {
      return await this.prisma.client.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `No se pudo eliminar el cliente #${id} (¿Tiene eventos asociados?)`,
      );
    }
  }
}
