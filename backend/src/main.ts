import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET'],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
