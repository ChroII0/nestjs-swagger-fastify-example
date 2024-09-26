import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';
import { SuccessResponseDTO } from './dto/success-response.dto';
import { exceptionSerialize } from './exception-serialize';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => this.successResultFormat(context, data)),
      catchError((error) => this.exceptionResultFormat(context, error)),
    );
  }

  private async successResultFormat(context: ExecutionContext, data: any) {
    const res = context.getArgByIndex(1);
    const statusCode = res.statusCode || HttpStatus.OK;

    return new SuccessResponseDTO(statusCode, data);
  }

  private async exceptionResultFormat(context: ExecutionContext, error: any) {
    if (!(error instanceof HttpException)) {
      throw exceptionSerialize(error);
    }

    throw error;
  }
}
