import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ICreateUser, IUpdateUser } from './interface';
import { UsersRepository } from './users.repository';
import { NullableUser } from './types/users.types';
import { SecurityService } from 'src/security/security.service';
import { User } from '@prisma/client';
import { ValidateService } from 'src/validate/validate.service';
import { ErrorHandlerService } from 'src/errro-catch/error-catch.service';
import { SortOrder } from 'src/global/global-types';

@Injectable()
export class UsersService {
	private readonly logger: Logger = new Logger(UsersService.name);

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly securityService: SecurityService,
		private readonly validateService: ValidateService,
		private readonly errorHandlerService: ErrorHandlerService
	) {}

	public async create(data: ICreateUser): Promise<User> {
		try {
			this.logger.log(`create: Starting process, email:${data.email}`);
			await this.checkIfUserExistsByEmail(data.email);
			this.logger.debug(`create: Email verified, email:${data.email}`);
			data.password = await this.securityService.hashPassword(data.password);
			this.logger.debug(`create: Password hashed, email:${data.email}`);
			return await this.usersRepository.saveUser(data);
		} catch (error) {
			this.logger.error(
				`create: Error in process, email:${data.email}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	private async checkIfUserExistsByEmail(email: string): Promise<void> {
		this.logger.log(
			`checkIfUserExistsByEmail: Starting process, email: ${email}`
		);
		const user: NullableUser =
			await this.usersRepository.findUserByEmail(email);
		this.logger.debug(
			`checkIfUserExistsByEmail: User search completed. email: ${email}, user exists:${!!user}`
		);
		this.rejectIfUserExists(user);
	}
	private rejectIfUserExists(user: NullableUser): void {
		this.logger.log(
			`rejectIfUserExists: Starting process. user exists: ${!!user}.`
		);
		if (user) {
			this.logger.warn(
				`rejectIfUserExists: User found. Registration denied, email:${user.email}.`
			);
			throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
		}
	}

	public async findAll(order: string, limit: string, offset: string) {
		try {
			this.logger.log(
				`findAll: Starting process, order:${order}, limit:${limit}, offset:${offset}`
			);
			const sortOrder: SortOrder = this.validateService.checkSortOrder(order);
			const limitNum: number = this.validateService.checkLimit(limit);
			const offsetNum: number = this.validateService.checkOffset(offset);
			this.logger.debug(
				`findAll: Parameters validated, order:${sortOrder}, limit:${limitNum}, offset:${offsetNum}`
			);
			return await this.usersRepository.findManyUsers(
				sortOrder,
				limitNum,
				offsetNum
			);
		} catch (error) {
			this.logger.error(`findAll: Error in process, error:${error.message}.`);
			this.errorHandlerService.handleError(error);
		}
	}

	public async update(id: string, data: IUpdateUser): Promise<User> {
		try {
			this.logger.log(`update: Starting process, userId:${id}.`);
			this.validateService.checkId(id);
			this.logger.debug(`update: id valid, userId:${id}.`);
			await this.getUserById(id);
			this.logger.debug(`update: User retrieved, userId:${id}.`);
			await this.validateUpdate(data);
			this.logger.debug(`update: Data validated, userId:${id}.`);
			const updatedUser = await this.usersRepository.updateUser(id, data);
			this.logger.debug(`update: User updated, userId:${id}.`);
			return updatedUser;
		} catch (error) {
			this.logger.error(
				`update: Error in process, userId:${id}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	private async validateUpdate(data: IUpdateUser) {
		this.logger.log(`validateUpdate: Starting process.`);
		if (data.email) {
			this.logger.debug(`validateUpdate: Email provided, email:${data.email}.`);
			await this.checkIfUserExistsByEmail(data.email);
			this.logger.debug(`validateUpdate: Email verified, email:${data.email}.`);
		}
		if (data.password) {
			this.logger.debug(`validateUpdate: Password provided.`);
			data.password = await this.securityService.hashPassword(data.password);
			this.logger.debug(`validateUpdate: Password hashed.`);
		}
		this.logger.log(`validateUpdate: Process completed.`);
	}

	public async findOne(id: string): Promise<User> {
		try {
			this.logger.log(`findOne: Starting process, userId:${id}.`);
			this.validateService.checkId(id);
			this.logger.debug(`findOne: id valid, userId:${id}.`);
			return await this.getUserById(id);
		} catch (error) {
			this.logger.error(
				`findOne: Error in process, userId:${id}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}

	public async getUserById(id: string): Promise<User> {
		this.logger.log(`getUserById: Starting process, userId: ${id}`);
		const user: NullableUser = await this.usersRepository.findUserById(id);
		this.logger.debug(
			`getUserById: User search completed, userId: ${id}, user exists:${!!user}`
		);
		this.handleUser(user);
		return user;
	}

	private handleUser(user: NullableUser): void {
		this.logger.log(`handleUser: Starting process. user exists: ${!!user}.`);
		if (!user) {
			this.logger.warn(`handleUser: User not found.`);
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	}

	public async remove(id: string) {
		try {
			this.logger.log(`findOne: Starting process, userId:${id}.`);
			this.validateService.checkId(id);
			this.logger.debug(`findOne: id valid, userId:${id}.`);
			await this.getUserById(id);
			return await this.usersRepository.deleteUser(id);
		} catch (error) {
			this.logger.error(
				`remove: Error in process, userId:${id}, error:${error.message}.`
			);
			this.errorHandlerService.handleError(error);
		}
	}
}
