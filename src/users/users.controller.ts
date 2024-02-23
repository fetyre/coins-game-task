import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	Res,
	HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Создать нового пользователя' })
	@ApiBody({ type: CreateUserDto, description: 'Данные пользователя' })
	@ApiResponse({
		status: 201,
		description: 'Пользователь успешно создан.',
		schema: {
			type: 'object',
			properties: {
				user: {
					type: 'object',
					properties: {
						id: { type: 'string', description: 'Id пользователя' },
						email: {
							type: 'string',
							description: 'Электронная почта пользователя'
						},
						name: { type: 'string', description: 'Имя пользователя' }
					}
				}
			}
		}
	})
	@Post()
	async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
		const user: User = await this.usersService.create(createUserDto);
		res.status(HttpStatus.CREATED).json({
			user: {
				id: user.id,
				email: user.email,
				name: user.username
			}
		});
	}

	@ApiOperation({ summary: 'Получить всех пользователей' })
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
	@ApiResponse({ status: 200, description: 'Возвращает всех пользователей.' })
	@Get()
	async findAll(
		@Query('sort') sort: string,
		@Query('limit') limit: string,
		@Query('offset') offset: string,
		@Res() res: Response
	) {
		const users: User[] = await this.usersService.findAll(sort, limit, offset);
		res.status(HttpStatus.OK).json(users);
	}

	@ApiOperation({ summary: 'Получить пользователя по id' })
	@ApiParam({ name: 'id', description: 'ID пользователя' })
	@ApiResponse({ status: 200, description: 'Возвращает пользователя.' })
	@Get(':id')
	async findOne(@Param('id') id: string, @Res() res: Response) {
		const user: User = await this.usersService.findOne(id);
		res.status(HttpStatus.OK).json(user);
	}

	@ApiOperation({ summary: 'Обновить пользователя' })
	@ApiParam({ name: 'id', description: 'ID пользователя' })
	@ApiBody({ type: UpdateUserDto, description: 'Новые данные пользователя' })
	@ApiResponse({ status: 200, description: 'Пользователь успешно обновлен.' })
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@Res() res: Response
	) {
		const updateUser: User = await this.usersService.update(id, updateUserDto);
		res.status(HttpStatus.OK).json(updateUser);
	}

	@ApiOperation({ summary: 'Удалить пользователя' })
	@ApiParam({ name: 'id', description: 'Id пользователя' })
	@ApiResponse({ status: 204, description: 'Пользователь успешно удален.' })
	@Delete(':id')
	async remove(@Param('id') id: string, @Res() res: Response) {
		await this.usersService.remove(id);
		res.status(HttpStatus.NO_CONTENT);
	}
}
