import { Global, Module } from '@nestjs/common';
import { LogModule } from '@/shared/log/log.module';
import { S3Service } from './s3.service';
import { s3Providers } from './s3.providers';

@Global()
@Module({
  imports: [
    LogModule
  ],
  providers: [...s3Providers, S3Service],
  exports: [S3Service],
})
export class S3Module { }
