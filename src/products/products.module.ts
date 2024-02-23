import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersService } from 'src/users/users.service';
import { ProductsRepository } from './products.repository';
import { ValidateService } from 'src/validate/validate.service';
import { UsersRepository } from 'src/users/users.repository';
import { SecurityService } from 'src/security/security.service';

@Module({
	controllers: [ProductsController],
	providers: [
		ProductsService,
		UsersService,
		ProductsRepository,
		ValidateService,
		UsersRepository,
		SecurityService
	]
})
export class ProductsModule {}
