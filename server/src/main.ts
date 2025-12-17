import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
// DELETE the line: import cors from 'cors'; // No longer needed
// DELETE the line: import { User } from './entities/user.entity'; // Not used in main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set the global API prefix (/api) as required by the specifications
  app.setGlobalPrefix('api'); // <--- CRITICAL for routes like /api/murmurs/
  
  // ミドルウェアの設定
  app.use(helmet());
  
  // 1. Use NestJS's built-in CORS solution (Recommended way)
  // This automatically handles the middleware without import errors.
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only the React client to connect
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies/authorization headers
  });
  
  await app.listen(3001);
  console.log('Example app listening on port 3001!');
}
bootstrap();