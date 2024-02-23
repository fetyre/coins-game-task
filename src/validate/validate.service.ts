import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SortOrder } from 'src/global/global-types';

const ID_REGEX: RegExp =
	/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const ID_LENGHT: number = 36;
const DEFAULT_LIMIT: number = 10;
const MAX_LIMIT: number = 100;
const DEFAULT_OFFSET: number = 0;
const BASE: number = 10;
const MIN_OFFSET: number = 0;
const DEFAULT_SORT_ORDER: SortOrder = 'asc';
const ALTERNATIVE_SORT_ORDER: SortOrder = 'desc';

@Injectable()
export class ValidateService {
	private readonly logger: Logger = new Logger(ValidateService.name);

	public checkId(id: string): void {
		this.logger.log('Starting checkId');
		this.checkIdRegex(id);
		this.checkIdLength(id);
	}

	private checkIdRegex(id: string): void {
		this.logger.log(`Starting checkIdRegex`);
		if (!ID_REGEX.test(id)) {
			throw new HttpException('Invalid identifier', HttpStatus.BAD_REQUEST);
		}
	}

	private checkIdLength(id: string): void {
		this.logger.log(`Starting checkIdLength`);
		if (id.length !== ID_LENGHT) {
			throw new HttpException('Invalid identifier', HttpStatus.BAD_REQUEST);
		}
	}

	public checkSortOrder(order: string): SortOrder {
		this.logger.log(`Starting checkSortOrder`);
		if (order !== DEFAULT_SORT_ORDER && order !== ALTERNATIVE_SORT_ORDER) {
			return DEFAULT_SORT_ORDER;
		}
		return order;
	}

	public checkLimit(limit: string): number {
		this.logger.log(`Starting checkLimit`);
		const parsedLimit = parseInt(limit, BASE);
		if (
			isNaN(parsedLimit) ||
			!Number.isInteger(parsedLimit) ||
			parsedLimit > MAX_LIMIT
		) {
			return DEFAULT_LIMIT;
		}
		return parsedLimit;
	}

	public checkOffset(offset: string): number {
		this.logger.log(`Starting checkOffset`);
		const parsedOffset = parseInt(offset, BASE);
		if (
			isNaN(parsedOffset) ||
			!Number.isInteger(parsedOffset) ||
			parsedOffset < MIN_OFFSET
		) {
			return DEFAULT_OFFSET;
		}
		return parsedOffset;
	}
}
