import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
	require('dotenv').config();

	const cookieParser = require('cookie-parser')
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true
	}))
	// this enables the cors middleware, which allows communication with other sources (frontend to backend)
	app.enableCors({
		origin: true,
		credentials: true
	})
	// lets us get data from cookies (i spent two days trying to understand why accessing cookies gives null, this was missing)
	app.use(cookieParser())
	global.prisma = new PrismaService(new ConfigService())
	await app.listen(3333);
}
bootstrap();
