import {
	IsNotEmpty,
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateUser } from '../interface';

const USERNAME_MIN_LENGTH: number = 2;
const USERNAME_MAX_LENGTH: number = 25;
const USERNAME_REGEX: RegExp = /^[a-zA-Zа-яА-Я\s]*$/;

const PASSWORD_MIN_LENGTH: number = 8;
const PASSWORD_MAX_LENGTH: number = 30;
const PASSWORD_REGEX: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}$/;

export class CreateUserDto implements ICreateUser {
	@ApiProperty({
		description: 'Имя пользователя',
		minLength: USERNAME_MIN_LENGTH,
		maxLength: USERNAME_MAX_LENGTH,
		example: 'Иван Иванов'
	})
	@IsNotEmpty({ message: 'Имя пользователя не должно быть пустым' })
	@IsString({ message: 'Имя пользователя должно быть строкой' })
	@MinLength(USERNAME_MIN_LENGTH, {
		message: `Имя пользователя должно содержать не менее ${USERNAME_MIN_LENGTH} символов`
	})
	@MaxLength(USERNAME_MAX_LENGTH, {
		message: `Имя пользователя должно содержать не более ${USERNAME_MAX_LENGTH} символов`
	})
	@Matches(USERNAME_REGEX, {
		message: 'Имя пользователя может содержать только буквы и пробелы'
	})
	username: string;

	@ApiProperty({
		description: 'Электронная почта пользователя',
		format: 'email',
		example: 'example@example.com'
	})
	@IsNotEmpty({ message: 'Электронная почта не должна быть пустой' })
	@IsEmail({}, { message: 'Неверный формат электронной почты' })
	email: string;

	@ApiProperty({
		description: 'Пароль пользователя',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
		example: 'Password123'
	})
	@IsNotEmpty({ message: 'Пароль не должен быть пустым' })
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(PASSWORD_MIN_LENGTH, {
		message: `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} символов`
	})
	@MaxLength(PASSWORD_MAX_LENGTH, {
		message: `Пароль должен содержать не более ${PASSWORD_MAX_LENGTH} символов`
	})
	@Matches(PASSWORD_REGEX, {
		message: 'Пароль должен содержать хотя бы одну букву и одну цифру'
	})
	password: string;
}
