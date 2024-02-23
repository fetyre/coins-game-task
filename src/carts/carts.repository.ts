import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/settings/prisma.database/prisma.service';
import { NullableCart } from './types/carts.types';
import { Cart } from '@prisma/client';

@Injectable()
export class CartsRepository {
	private readonly logger: Logger = new Logger(CartsRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	public async findActiveCart(userId: string): Promise<NullableCart> {
		return await this.prisma.cart.findFirst({
			where: {
				userId,
				isActive: true
			}
		});
	}

	public async saveCart(userId: string, productIds: string[]): Promise<Cart> {
		return await this.prisma.cart.create({
			data: {
				userId,
				products: { connect: productIds.map(id => ({ id })) }
			}
		});
	}

	public async findCartById(id: string): Promise<NullableCart> {
		this.logger.log(`findCartById: Starting process. cartId: ${id}`);
		return await this.prisma.cart.findUnique({
			where: { id }
		});
	}

	public async deleteCart(id: string): Promise<Cart> {
		this.logger.log(`findCartById: Starting process. cartId: ${id}`);
		return await this.prisma.cart.delete({
			where: { id }
		});
	}

	public async updateCart(
		id: string,
		productIds: string[],
		isActive: boolean | undefined
	): Promise<Cart> {
		this.logger.log(`updateCart: Starting process. cartId: ${id}`);
		return await this.prisma.cart.update({
			where: { id },
			data: {
				products: { connect: productIds.map(id => ({ id })) },
				isActive: isActive
			}
		});
	}
}
