import { Injectable, Logger } from '@nestjs/common';
import { NullableUser, UserWithCartOrNull } from './types/users.types';
import { ICreateUser, IUpdateUser } from './interface';
import { PrismaService } from 'src/settings/prisma.database/prisma.service';
import { User } from '@prisma/client';
import { SortOrder } from 'src/global/global-types';

@Injectable()
export class UsersRepository {
	private readonly logger: Logger = new Logger(UsersRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	public async findUserByEmail(email: string): Promise<NullableUser> {
		this.logger.log(`findUserByEmail: Starting process. email: ${email}`);
		return await this.prisma.user.findUnique({
			where: { email }
		});
	}

	public async saveUser(createData: ICreateUser): Promise<User> {
		this.logger.log(`saveUser: Starting process, email:${createData.email}.`);
		return await this.prisma.user.create({
			data: { ...createData }
		});
	}

	public async findUserById(id: string): Promise<NullableUser> {
		this.logger.log(`findUserById: Starting process. userId: ${id}`);
		return await this.prisma.user.findUnique({
			where: { id }
		});
	}

	public async updateUser(id: string, data: IUpdateUser): Promise<User> {
		this.logger.log(`updateUser: Starting process. userId: ${id}`);
		return await this.prisma.user.update({
			where: { id },
			data: {
				...data
			}
		});
	}

	public async deleteUser(id: string): Promise<User> {
		this.logger.log(`deleteUser: Starting process. userId: ${id}`);
		return await this.prisma.user.delete({
			where: { id }
		});
	}

	public async getUserWithCart(id: string): Promise<UserWithCartOrNull> {
		this.logger.log(`getUserWithCart: Starting process. userId: ${id}`);
		return await this.prisma.user.findUnique({
			where: { id },
			include: {
				cart: {
					where: { isActive: true }
				}
			}
		});
	}

	public async findManyUsers(
		order: SortOrder,
		limit: number,
		offset: number
	): Promise<User[]> {
		this.logger.log(`findManyUsers: Starting process.`);
		return await this.prisma.user.findMany({
			take: limit,
			skip: offset,
			orderBy: {
				createdAt: order
			}
		});
	}
}
