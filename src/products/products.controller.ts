import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	Res,
	Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { Response } from 'express';

import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
	ApiBody
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@ApiOperation({ summary: 'Создать новый продукт' })
	@ApiBody({ type: CreateProductDto, description: 'Данные продукта' })
	@ApiResponse({ status: 201, description: 'Продукт успешно создан.' })
	@Post()
	async create(
		@Body() createProductDto: CreateProductDto,
		@Res() res: Response
	) {
		const product: Product =
			await this.productsService.create(createProductDto);
		res.status(HttpStatus.CREATED).json(product);
	}

	@ApiOperation({ summary: 'Получить все продукты' })
	@ApiQuery({
		name: 'sort',
		required: false,
		description: 'Порядок сортировки'
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: 'Ограничить количество результатов'
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		description: 'Количество пропущенных результатов'
	})
	@ApiQuery({ name: 'userId', required: false, description: 'ID пользователя' })
	@ApiResponse({ status: 200, description: 'Возвращает все продукты.' })
	@Get()
	async findAll(
		@Query('sort') sort: string,
		@Query('limit') limit: string,
		@Query('offset') offset: string,
		@Query('userId') userId: string,
		@Res() res: Response
	) {
		const products: Product[] = await this.productsService.findAll(
			sort,
			limit,
			offset,
			userId
		);
		res.status(HttpStatus.OK).json(products);
	}

	@ApiOperation({ summary: 'Получить продукт по id' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiResponse({ status: 200, description: 'Возвращает продукт.' })
	@Get(':id')
	async findOne(@Param('id') id: string, @Res() res: Response) {
		const product: Product = await this.productsService.findOne(id);
		res.status(HttpStatus.OK).json(product);
	}

	@ApiOperation({ summary: 'Обновить продукт' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiBody({ type: UpdateProductDto, description: 'Новые данные продукта' })
	@ApiResponse({ status: 200, description: 'Продукт успешно обновлен.' })
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
		@Res() res: Response
	) {
		const product: Product = await this.productsService.update(
			id,
			updateProductDto
		);
		res.status(HttpStatus.OK).json(product);
	}

	@ApiOperation({ summary: 'Удалить продукт' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiParam({ name: 'userId', description: 'ID пользователя' })
	@ApiResponse({ status: 204, description: 'Продукт успешно удален.' })
	@Delete(':id/:userId')
	async remove(
		@Param('id') id: string,
		@Param('userId') userId: string,
		@Res() res: Response
	) {
		await this.productsService.remove(id, userId);
		res.status(HttpStatus.NO_CONTENT);
	}
}
