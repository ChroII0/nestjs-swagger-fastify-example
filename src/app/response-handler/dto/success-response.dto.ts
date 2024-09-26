import { BaseResponseDTO } from './base-response.dto';

export class SuccessResponseDTO<T> extends BaseResponseDTO {
  data?: T;

  constructor(statusCode: number, data?: T) {
    super(statusCode, true);
    this.data = data;
  }
}
