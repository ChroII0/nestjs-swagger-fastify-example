import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDTO } from './base-response.dto';

export class ErrorResponseDTO extends BaseResponseDTO {
  @ApiPropertyOptional({ type: String })
  message?: string;

  constructor(statusCode: number, message?: string) {
    super(statusCode, false);
    this.message = message;
  }
}
