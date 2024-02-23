import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SecurityService } from 'src/security/security.service';
import { UsersRepository } from './users.repository';
import { ValidateService } from 'src/validate/validate.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService, SecurityService, UsersRepository, ValidateService]
})
export class UsersModule {}
