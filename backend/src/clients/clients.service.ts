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

  // Por ahora dejaremos update y remove pendientes para no complicarnos
  update(id: number, updateClientDto: any) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}