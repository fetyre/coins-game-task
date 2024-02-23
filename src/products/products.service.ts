import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ICreateProduct, IUpdateProduct } from './interface';
import { UsersService } from 'src/users/users.service';
import { ProductsRepository } from './products.repository';
import { Product } from '@prisma/client';
import { ValidateService } from 'src/validate/validate.service';
import { NullableProduct } from './types/products.types';
import { ErrorHandlerService } from 'src/errro-catch/error-catch.service';
import { SortOrder } from 'src/global/global-types';

@Injectable()
export class ProductsService {
	private readonly logger: Logger = new Logger(ProductsService.name);

	constructor(
		private readonly usersSerivce: UsersService,
		private readonly productsRepository: ProductsRepository,
		private readonly validateService: ValidateService,
		private readonly errorHandlerService: ErrorHandlerService
	) {}

	public async create(data: ICreateProduct): Promise<Product> {
		try {
			this.logger.log(`create: Starting process, userId:${data.userId}`);
			await this.usersSerivce.getUserById(data.userId);
			this.logger.debug(`create: User verified, userId:${data.userId}`);
			return await this.productsRepository.saveProducts(data);
		} catch (error) {
			this.logger.error(
				`create: Error in process, userId:${data.userId}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	public async findAll(
		order: string,
		limit: string,
		offset: string,
		userId: string
	) {
		try {
			this.logger.log(
				`findAll: Starting process, order:${order}, limit:${limit}, offset:${offset}`
			);
			const sortOrder: SortOrder = this.validateService.checkSortOrder(order);
			const limitNum: number = this.validateService.checkLimit(limit);
			const offsetNum: number = this.validateService.checkOffset(offset);
			this.logger.debug(
				`findAll: Parameters validated, order:${sortOrder}, limit:${limitNum}, offset:${offsetNum}`
			);
			return await this.productsRepository.findManyProducts(
				sortOrder,
				limitNum,
				offsetNum,
				userId
			);
		} catch (error) {
			this.logger.error(`findAll: Error in process, error:${error.message}.`);
			this.errorHandlerService.handleError(error);
		}
	}

	public async findOne(id: string): Promise<Product> {
		try {
			this.logger.log(`findOne: Starting process, productId:${id}`);
			this.validateService.checkId(id);
			this.logger.debug(`findOne: id valid, productId:${id}`);
			return await this.getProductById(id);
		} catch (error) {
			this.logger.error(
				`findOne: Error in process, productId:${id}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	public async getProductById(id: string): Promise<Product> {
		this.logger.log(`getProductById: Starting process, productId: ${id}`);
		const product: NullableProduct =
			await this.productsRepository.findProductById(id);
		this.logger.debug(
			`getProductById: Product search completed, productId: ${id}, product exists:${!!product}`
		);
		this.handleProduct(product);
		return product;
	}

	private handleProduct(product: NullableProduct): void {
		this.logger.log(
			`handleProduct: Starting process. product exists: ${!!product}.`
		);
		if (!product) {
			this.logger.warn(`handleProduct: Product not found.`);
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
	}

	public async update(
		id: string,
		updateData: IUpdateProduct
	): Promise<Product> {
		try {
			this.logger.log(`update: Starting process, productId:${id}`);
			this.validateService.checkId(id);
			this.logger.debug(`update: id valid, productId:${id}`);
			const product: Product = await this.getProductById(id);
			this.logger.debug(`update: Product search completed, productId:${id}`);
			this.validateUser(product, updateData.userId);
			delete updateData.userId;
			return await this.productsRepository.updateProduct(id, updateData);
		} catch (error) {
			this.logger.error(
				`update: Error in process, productId:${id}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	public async remove(productId: string, userId: string): Promise<Product> {
		try {
			this.logger.log(
				`remove: Starting process, productId:${productId}, userId:${userId}`
			);
			this.validateService.checkId(productId);
			this.logger.debug(`remove: id valid, productId:${productId}`);
			this.validateService.checkId(userId);
			this.logger.debug(`remove: id valid, userId:${userId}`);
			const product: Product = await this.getProductById(productId);
			this.logger.debug(
				`remove: Product search completed, productId:${productId}`
			);
			this.validateUser(product, userId);
			return await this.productsRepository.deleteProduct(productId);
		} catch (error) {
			this.logger.error(
				`remove: Error in process, productId:${productId}, userId:${userId}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	private validateUser(product: Product, userId: string): void {
		this.logger.log(`validateUser: Starting process, userId:${userId}`);
		if (product.userId !== userId) {
			this.logger.warn(`validateUser: Unauthorized Access, userId:${userId}`);
			throw new HttpException('Unauthorized Access', HttpStatus.FORBIDDEN);
		}
	}
}
