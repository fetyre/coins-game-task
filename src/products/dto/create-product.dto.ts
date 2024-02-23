import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsNumber,
	IsPositive,
	IsUUID
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const NAME_MIN_LENGTH: number = 2;
const NAME_MAX_LENGTH: number = 50;
const NAME_REGEX: RegExp = /^[a-zA-Z0-9а-яА-ЯёЁ]*$/;

const DESCRIPTION_MIN_LENGTH: number = 5;
const DESCRIPTION_MAX_LENGTH: number = 100;
const DESCRIPTION_REGEX: RegExp = /^[a-zA-Z0-9а-яА-ЯёЁ]*$/;

const PRICE_DECIMAL_PLACES = 2;

export class CreateProductDto {
	@ApiProperty({
		description: 'Имя продукта',
		minLength: NAME_MIN_LENGTH,
		maxLength: NAME_MAX_LENGTH,
		example: 'Пельмени)) '
	})
	@IsNotEmpty({ message: 'Имя продукта не должно быть пустым' })
	@IsString({ message: 'Имя продукта должно быть строкой' })
	@MinLength(NAME_MIN_LENGTH, {
		message: `Имя продукта должно содержать не менее ${NAME_MIN_LENGTH} символов`
	})
	@MaxLength(NAME_MAX_LENGTH, {
		message: `Имя продукта должно содержать не более ${NAME_MAX_LENGTH} символов`
	})
	@Matches(NAME_REGEX, {
		message: 'Имя продукта может содержать только буквы и цифры'
	})
	name: string;

	@ApiProperty({
		description: 'Описание продукта',
		minLength: DESCRIPTION_MIN_LENGTH,
		maxLength: DESCRIPTION_MAX_LENGTH,
		example: 'Еда богов.',
		required: false
	})
	@IsOptional()
	@IsString({ message: 'Описание продукта должно быть строкой' })
	@MinLength(DESCRIPTION_MIN_LENGTH, {
		message: `Описание продукта должно содержать не менее ${DESCRIPTION_MIN_LENGTH} символов`
	})
	@MaxLength(DESCRIPTION_MAX_LENGTH, {
		message: `Описание продукта должно содержать не более ${DESCRIPTION_MAX_LENGTH} символов`
	})
	@Matches(DESCRIPTION_REGEX, {
		message:
			'Описание продукта может содержать любые буквы, цифры, знаки препинания, специальные символы и пробелы'
	})
	description?: string;

	@ApiProperty({
		description: 'Цена продукта',
		minimum: 0,
		exclusiveMinimum: true,
		maximum: Number.MAX_VALUE,
		example: 'даром'
	})
	@IsNotEmpty({ message: 'Цена продукта не должна быть пустой' })
	@IsNumber(
		{ maxDecimalPlaces: PRICE_DECIMAL_PLACES },
		{
			message: `Цена продукта должна быть числом с не более чем ${PRICE_DECIMAL_PLACES} знаками после запятой`
		}
	)
	@IsPositive({ message: 'Цена продукта должна быть положительной' })
	price: number;

	@ApiProperty({
		description: 'ID пользователя',
		format: 'uuid',
		example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
	})
	@IsNotEmpty({ message: 'ID пользователя не должен быть пустым' })
	@IsUUID(4, { message: 'ID пользователя должен быть в формате UUID версии 4' })
	userId: string;
}
