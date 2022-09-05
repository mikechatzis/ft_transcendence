import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true
  }))
  // this enables the cors middleware, which allows communication with other sources (frontend to backend)
  app.enableCors()
//   app.use(bodyParser.json())
  await app.listen(3333);
}
bootstrap();
