import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const ROUND_PASSWORD: number = 10;

@Injectable()
export class SecurityService {
	private readonly logger: Logger = new Logger(SecurityService.name);

	public async hashPassword(password: string): Promise<string> {
		this.logger.log(`Starting hashPassword`);
		return await bcrypt.hash(password, ROUND_PASSWORD);
	}
}
