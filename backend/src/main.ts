import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- Agrega esto también, lo necesitaremos para que el Frontend nos hable
  await app.listen(4000); // <--- CAMBIO AQUÍ
}
bootstrap();
