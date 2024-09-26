import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const exceptionSerialize = (exception: any) => {
  if (!(exception instanceof HttpException)) {
    const message = exception?.message || exception?.error;
    return new InternalServerErrorException(message);
  }

  return exception;
};
