import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { UsersRepository } from 'src/users/users.repository';
import { ValidateService } from 'src/validate/validate.service';
import { CartsRepository } from './carts.repository';
import { ProductsRepository } from 'src/products/products.repository';

@Module({
	controllers: [CartsController],
	providers: [
		CartsService,
		UsersRepository,
		ValidateService,
		CartsRepository,
		ProductsRepository
	]
})
export class CartsModule {}
