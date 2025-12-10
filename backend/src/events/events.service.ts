import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto'; // Asegúrate de importar esto
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { clientId, date, ...data } = createEventDto;
    return await this.prisma.event.create({
      data: {
        ...data,
        date: new Date(date),
        client: { connect: { id: clientId } },
      },
      include: { client: true },
    });
  }

  async findAll() {
    return await this.prisma.event.findMany({
      // AGREGAMOS "menu: true" AQUÍ:
      include: {
        client: true,
        menu: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  // --- NUEVO: Búsqueda Real por UUID ---
  async findOneByUuid(uuid: string) {
    const event = await this.prisma.event.findUnique({
      where: { uuid },
      include: { client: true, menu: true }, // Traemos todo
    });
    if (!event) throw new NotFoundException(`Evento no encontrado`);
    return event;
  }

  // --- CORRECCIÓN: Update Real ---
  async update(id: number, updateEventDto: UpdateEventDto) {
    // Extraemos datos especiales si vienen en el DTO
    const { clientId, menuId, date, ...rest } = updateEventDto as any;

    const dataToUpdate: any = { ...rest };

    // Si viene fecha, la convertimos
    if (date) dataToUpdate.date = new Date(date);

    // Si viene menuId, conectamos la relación
    if (menuId) dataToUpdate.menu = { connect: { id: Number(menuId) } };

    return await this.prisma.event.update({
      where: { id },
      data: dataToUpdate,
      include: { menu: true },
    });
  }

  async remove(id: number) {
    // Primero verificamos si existe (opcional, pero buena práctica)
    try {
      return await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      // Si falla (ej: no existe), lanzamos un error que Nest entienda
      throw new Error(`No se pudo eliminar el evento #${id}`);
    }
  }

  // Dejamos los demás como stubs por ahora si quieres
  findOne(id: number) {
    return `This action returns a #${id} event`;
  }
}
