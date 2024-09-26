import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import { AppModule } from './app.module';
import { customExceptionFactory } from './app/response-handler/exception-factory';
import { CustomExceptionFilter } from './app/response-handler/exception-filter';
import { ResponseFormatInterceptor } from './app/response-handler/response-format.Interceptor';
import { setupSwagger } from './app/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      disableRequestLogging: true,
    })
  );
  app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN_LIST.split(','),
    credentials: true,
  });
  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.register(fastifySensible);
  app.register(fastifyMultipart, {
    limits: {
      fields: 5,
      files: 1,
      fileSize: Number(process.env.UPLOAD_FILE_SIZE_LIMIT),
      headerPairs: 100,
    },
    attachFieldsToBody: true,
  });
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: customExceptionFactory,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  setupSwagger(app);

  await app.listen(8080);
}
bootstrap();
