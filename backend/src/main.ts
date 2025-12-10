import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que el frontend (desde otro dominio) pueda hablarle
  app.enableCors(); 

  // USAR EL PUERTO QUE NOS DE LA NUBE O EL 4000 SI ESTAMOS EN LOCAL
  const port = process.env.PORT || 4000; 
  await app.listen(port);
  console.log(`🚀 Backend corriendo en el puerto ${port}`);
}
bootstrap();