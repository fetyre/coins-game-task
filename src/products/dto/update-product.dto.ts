import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IUpdateProduct } from '../interface';

export class UpdateProductDto
	extends PartialType(CreateProductDto)
	implements IUpdateProduct
{
	@ApiProperty({ description: 'ID пользователя' })
	@IsNotEmpty({ message: 'ID пользователя не должен быть пустым' })
	@IsUUID(4, { message: 'ID пользователя должен быть в формате UUID версии 4' })
	userId: string;
}
