import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

/**
 * @class ErrorHandlerService
 * @description Сервис для обработки ошибок
 */
@Injectable()
export class ErrorHandlerService {
	private readonly logger: Logger = new Logger(ErrorHandlerService.name);

	public handleError(error: any): void {
		this.logger.error(
			`handleError: An error occurred, error: ${error.message}`
		);
		if (error instanceof HttpException) {
			return this.handleHttpException(error);
		} else {
			return this.handleUnknownError(error);
		}
	}

	private handleHttpException(error: HttpException): void {
		this.logger.error(
			`handleHttpException: Throwing HttpException with message: ${error.message}`
		);
		throw error;
	}

	private handleUnknownError(error: any): void {
		this.logger.fatal(
			`handleUnknownError: Critical error occurred, error: ${error.message}`
		);
		throw new HttpException(
			'Internet server error',
			HttpStatus.INTERNAL_SERVER_ERROR
		);
	}
}
