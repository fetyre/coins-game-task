import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { PrismaModule } from './settings/prisma.database/prisma.module';
import { UsersModule } from './users/users.module';
import { ValidateModule } from './validate/validate.module';
import { SecurityModule } from './security/security.module';
import { ErrorHandlerModule } from './errro-catch/error-catch.module';

@Module({
	imports: [
		ProductsModule,
		CartsModule,
		PrismaModule,
		UsersModule,
		ValidateModule,
		SecurityModule,
		ErrorHandlerModule
	]
})
export class AppModule {}
