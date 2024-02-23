import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsUUID} from 'class-validator';
import { ICreateCart } from '../interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto implements ICreateCart {
	@ApiProperty({
		description: 'Массив UUID продуктов',
		type: [String],
		minLength: 1,
		maxLength: 20,
		example: ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11']
	})
	@IsNotEmpty({ message: 'Массив продуктов не должен быть пустым' })
	@IsArray({ message: 'Продукты должны быть представлены в виде массива' })
	@ArrayMinSize(1, {
		message: 'Массив продуктов должен содержать хотя бы один элемент'
	})
	@ArrayMaxSize(20, {
		message: 'Массив продуктов не должен содержать более 20 элементов'
	})
	@IsUUID(4, {
		each: true,
		message: 'Каждый продукт должен быть в формате UUID версии 4'
	})
	@IsNotEmpty({ each: true, message: 'UUID продукта не должен быть пустым' })
	products: string[];
}
