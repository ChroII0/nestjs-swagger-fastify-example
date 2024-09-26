import { SWAGGER_INFO } from '@/common/constant/swagger-info';
import { SWAGGER_EXTERNAL_DOCS } from '@/common/constant/swagger-external-docs';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_INFO.title)
    .setDescription(SWAGGER_INFO.description)
    .setVersion(SWAGGER_INFO.version)
    .setExternalDoc(SWAGGER_EXTERNAL_DOCS.description, SWAGGER_EXTERNAL_DOCS.url)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
};
