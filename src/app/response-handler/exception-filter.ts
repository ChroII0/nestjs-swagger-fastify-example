import { ErrorResponseDTO } from '@/app/response-handler/dto/error-response.dto';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { exceptionSerialize } from './exception-serialize';
import { FastifyReply } from 'fastify';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const error = exceptionSerialize(exception);

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<FastifyReply>();
      const status = error.getStatus();

      res.code(status).send(new ErrorResponseDTO(status, error.message));
    }
  }
}
