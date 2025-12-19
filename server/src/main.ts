import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser()); // Add this line before everything else
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();