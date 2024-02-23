import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ICreateCart, IUpdateCart } from './interface';
import { ValidateService } from 'src/validate/validate.service';
import { CartsRepository } from './carts.repository';
import { UsersRepository } from 'src/users/users.repository';
import { UserWithCartOrNull } from 'src/users/types/users.types';
import { Cart } from '@prisma/client';
import { ProductsRepository } from 'src/products/products.repository';
import { NullableProduct } from 'src/products/types/products.types';
import { NullableCart } from './types/carts.types';
import { ErrorHandlerService } from 'src/errro-catch/error-catch.service';

const EMPTY_ARRAY_LENGTH: number = 0;

@Injectable()
export class CartsService {
	private readonly logger: Logger = new Logger(CartsService.name);

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly validateService: ValidateService,
		private readonly cartsRepository: CartsRepository,
		private readonly productsRepository: ProductsRepository,
		private readonly errorHandlerService: ErrorHandlerService
	) {}

	public async create(data: ICreateCart, userId: string): Promise<Cart> {
		try {
			this.logger.log(`create: Starting process, userId:${userId}`);
			this.validateService.checkId(userId);
			await this.checkUserAndActiveCart(userId);
			const productIds: string[] = await this.addProductsToCart(data);
			this.validateLengProducts(productIds);
			return await this.cartsRepository.saveCart(userId, productIds);
		} catch (error) {
			this.logger.error(
				`create: Error in process, userId:${userId}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	private validateLengProducts(productIds: string[]): void {
		this.logger.log(`validateLengProducts: Starting process`);
		if (productIds.length === EMPTY_ARRAY_LENGTH) {
			throw new HttpException(
				'No valid products were provided',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	public async addProductsToCart(
		data: ICreateCart | IUpdateCart
	): Promise<string[]> {
		this.logger.log(`addProductsToCart: Starting process`);
		const validProductIds: string[] = [];
		validateProducts: for (const id of data.products) {
			const product: NullableProduct =
				await this.productsRepository.findProductById(id);
			if (product) {
				validProductIds.push(id);
			}
		}
		return validProductIds;
	}

	private async checkUserAndActiveCart(userId: string): Promise<void> {
		this.logger.log(
			`checkUserAndActiveCart: Starting process, userId:${userId}`
		);
		const userWithCart: UserWithCartOrNull =
			await this.usersRepository.getUserWithCart(userId);
		this.handleUser(userWithCart);
		const { cart, ...user } = userWithCart;
		this.validateCart(cart);
	}

	private validateCart(carts: Cart[]): void {
		this.logger.log(`validateCart: Starting process`);
		if (carts.length !== EMPTY_ARRAY_LENGTH) {
			throw new HttpException(
				'An active cart already exists for this user',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	private handleUser(user: UserWithCartOrNull): void {
		this.logger.log(`handleUser: Starting process. user exists: ${!!user}.`);
		if (!user) {
			this.logger.warn(`handleUser: User not found.`);
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	}

	public async findOne(id: string, userId: string): Promise<Cart> {
		try {
			this.logger.log(
				`findOne: Starting process, cartId:${id}, userId:${userId}`
			);
			this.validateService.checkId(id);
			this.validateService.checkId(userId);
			const cart: Cart = await this.getCartById(id);
			this.validateUser(cart, userId);
			return cart;
		} catch (error) {
			this.logger.error(
				`findOne: Error in process, cartId:${id}, userId:${userId}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	public async update(
		id: string,
		data: IUpdateCart,
		userId: string
	): Promise<Cart> {
		try {
			this.logger.log(
				`update: Starting process, cartId:${id}, userId:${userId}`
			);
			this.validateService.checkId(id);
			this.validateService.checkId(userId);
			const cart: Cart = await this.getCartById(id);
			this.validateCatyStatus(cart);
			this.validateUser(cart, userId);
			const productIds: string[] = await this.addProductsToCart(data);
			this.validateLengProducts(productIds);
			return await this.cartsRepository.updateCart(
				id,
				productIds,
				data.idActice
			);
		} catch (error) {
			this.errorHandlerService.handleError(error);
		}
	}

	private validateCatyStatus(cart: Cart): void {
		this.logger.log(
			`validateCatyStatus: Starting process, carttId: ${cart.id}`
		);
		if (!cart.isActive) {
			throw new HttpException('Cart is not active', HttpStatus.BAD_REQUEST);
		}
	}

	public async getCartById(id: string): Promise<Cart> {
		this.logger.log(`getProductById: Starting process, carttId: ${id}`);
		const cart: NullableCart = await this.cartsRepository.findCartById(id);
		this.logger.debug(
			`getProductById: Cart search completed, cartId: ${id}, cart exists:${!!cart}`
		);
		this.handleCart(cart);
		return cart;
	}

	private handleCart(cart: NullableCart): void {
		this.logger.log(`handleProduct: Starting process. cart exists: ${!!cart}.`);
		if (!cart) {
			this.logger.warn(`handleProduct: Cart not found.`);
			throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
		}
	}

	public async remove(id: string, userId: string): Promise<Cart> {
		try {
			this.logger.log(
				`remove: Starting process, cartId:${id}, userId:${userId}`
			);
			this.validateService.checkId(id);
			this.validateService.checkId(userId);
			const cart: Cart = await this.getCartById(id);
			this.validateUser(cart, userId);
			return await this.cartsRepository.deleteCart(id);
		} catch (error) {
			this.logger.error(
				`remove: Error in process, cartId:${id}, userId:${userId}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	private validateUser(cart: Cart, userId: string): void {
		this.logger.log(
			`validateUser: Starting process, carttId: ${cart.id}, userId${userId}`
		);
		if (cart.userId !== userId) {
			throw new HttpException('Unauthorized Access', HttpStatus.FORBIDDEN);
		}
	}
}
