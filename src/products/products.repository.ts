import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/settings/prisma.database/prisma.service';
import { Product } from '@prisma/client';
import { ICreateProduct, IUpdateProduct } from './interface';
import { NullableProduct } from './types/products.types';
import { SortOrder } from 'src/global/global-types';

@Injectable()
export class ProductsRepository {
	private readonly logger: Logger = new Logger(ProductsRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	public async saveProducts(data: ICreateProduct): Promise<Product> {
		this.logger.log(`saveProducts: Starting process, userId:${data.userId}.`);
		return await this.prisma.product.create({
			data: { ...data }
		});
	}

	public async findProductById(id: string): Promise<NullableProduct> {
		this.logger.log(`findProductById: Starting process. productId: ${id}`);
		return await this.prisma.product.findUnique({
			where: { id }
		});
	}

	public async updateProduct(
		id: string,
		data: Omit<IUpdateProduct, 'userId'>
	): Promise<Product> {
		this.logger.log(`updateUser: Starting process. productId: ${id}`);
		return await this.prisma.product.update({
			where: { id },
			data: {
				...data
			}
		});
	}

	public async deleteProduct(id: string): Promise<Product> {
		this.logger.log(`deleteProduct: Starting process. productId: ${id}`);
		return await this.prisma.product.delete({
			where: { id }
		});
	}

	public async findManyProducts(
		order: SortOrder,
		limit: number,
		offset: number,
		userId: string
	): Promise<Product[]> {
		this.logger.log(`findManyProducts: Starting process.`);
		return await this.prisma.product.findMany({
			where: {
				userId
			},
			take: limit,
			skip: offset,
			orderBy: {
				createdAt: order
			}
		});
	}
}
