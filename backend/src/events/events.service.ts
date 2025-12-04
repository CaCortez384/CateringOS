import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // <--- No olvides importar esto

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { clientId, date, ...data } = createEventDto;

    return await this.prisma.event.create({
      data: {
        ...data,
        date: new Date(date), // Convertimos el string de JSON a objeto Date real
        // AQUÍ OCURRE LA MAGIA RELACIONAL:
        client: {
          connect: { id: clientId }, 
        },
      },
      // Esto le dice a Prisma: "Devuélveme el evento CREADO, pero incluye los datos del cliente también"
      include: {
        client: true, 
      }
    });
  }

  // Completa el findAll para ver los datos anidados después
  async findAll() {
    return await this.prisma.event.findMany({
      include: { client: true },
    });
  }
  
  // ... deja el resto como está por ahora
  findOne(id: number) { return `This action returns a #${id} event`; }
  update(id: number, updateEventDto: any) { return `This action updates a #${id} event`; }
  remove(id: number) { return `This action removes a #${id} event`; }
}