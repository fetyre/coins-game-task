import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	Res
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from '@prisma/client';
import { Response } from 'express';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody
} from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('users/:userId/carts')
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@ApiOperation({ summary: 'Создать новую корзину' })
	@ApiBody({ type: CreateCartDto, description: 'Данные корзины' })
	@ApiResponse({ status: 201, description: 'Корзина успешно создана.' })
	@Post()
	async create(
		@Param('userId') userId: string,
		@Body() createCartDto: CreateCartDto,
		@Res() res: Response
	) {
		const cart: Cart = await this.cartsService.create(createCartDto, userId);
		res.status(HttpStatus.CREATED).json(cart);
	}

	@ApiOperation({ summary: 'Получить корзину по id' })
	@ApiParam({ name: 'userId', description: 'ID пользователя' })
	@ApiParam({ name: 'id', description: 'ID корзины' })
	@ApiResponse({ status: 200, description: 'Возвращает корзину.' })
	@Get(':id')
	async findOne(
		@Param('userId') userId: string,
		@Param('id') id: string,
		@Res() res: Response
	) {
		const cart: Cart = await this.cartsService.findOne(userId, id);
		res.status(HttpStatus.OK).json(cart);
	}

	@ApiOperation({ summary: 'Обновить корзину' })
	@ApiParam({ name: 'userId', description: 'ID пользователя' })
	@ApiParam({ name: 'id', description: 'ID корзины' })
	@ApiBody({ type: UpdateCartDto, description: 'Новые данные корзины' })
	@ApiResponse({ status: 200, description: 'Корзина успешно обновлена.' })
	@Patch(':id')
	async update(
		@Param('userId') userId: string,
		@Param('id') id: string,
		@Body() updateCartDto: UpdateCartDto,
		@Res() res: Response
	) {
		const cart: Cart = await this.cartsService.update(
			id,
			updateCartDto,
			userId
		);
		res.status(HttpStatus.OK).json(cart);
	}

	@ApiOperation({ summary: 'Удалить корзину' })
	@ApiParam({ name: 'userId', description: 'ID пользователя' })
	@ApiParam({ name: 'id', description: 'ID корзины' })
	@ApiResponse({ status: 204, description: 'Корзина успешно удалена.' })
	@Delete(':id')
	async remove(
		@Param('userId') userId: string,
		@Param('id') id: string,
		@Res() res: Response
	) {
		await this.cartsService.remove(userId, id);
		res.status(HttpStatus.NO_CONTENT);
	}
}
