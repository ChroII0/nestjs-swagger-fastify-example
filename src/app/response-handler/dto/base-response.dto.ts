import { ApiResponseProperty } from '@nestjs/swagger';

export class BaseResponseDTO {
  @ApiResponseProperty({ type: Boolean })
  success: boolean;
  status: number;

  constructor(statusCode: number, success: boolean) {
    this.status = statusCode;
    this.success = success;
  }
}
