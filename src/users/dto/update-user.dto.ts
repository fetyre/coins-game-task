import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUser } from '../interface';

export class UpdateUserDto
	extends PartialType(CreateUserDto)
	implements IUpdateUser {}
