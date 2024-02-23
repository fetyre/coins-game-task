import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './settings/prisma.database/prisma.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prismaService: PrismaService = app.get(PrismaService);
	app
		.getHttpAdapter()
		.getInstance()
		.on('beforeShutdown', async () => {
			await prismaService.$disconnect();
		});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);
	const config = new DocumentBuilder()
		.setTitle('NestJS Example App')
		.setDescription('The API description')
		.setVersion('1.0')
		.addTag('Task')
		.build();
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(3000);
}
bootstrap();
