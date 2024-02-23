import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IUpdateCart } from '../interface';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCartDto
	extends PartialType(CreateCartDto)
	implements IUpdateCart
{
	@ApiPropertyOptional({ description: 'Активна ли корзина', example: true })
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
