import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger: Logger = new Logger(PrismaService.name);

	async onModuleInit(): Promise<void> {
		this.logger.log('onModuleInit: Process start, Connecting to the database.');
		await this.$connect();
		this.logger.log('onModuleInit:Connected to the database.');
	}

	async onModuleDestroy(): Promise<void> {
		this.logger.log(
			'onModuleDestroy: Process start, Disconnecting from the database.'
		);
		await this.$disconnect();
		this.logger.log('onModuleDestroy: Disconnected from the database.');
	}
}
