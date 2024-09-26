import { Global, Module } from '@nestjs/common';
import { LogModule } from '@/shared/log/log.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticController } from './static.controller';
import { StaticFile, StaticFileSchema } from './dao/static.entity';
import { StaticService } from './static.service';
import { StaticFileDAO } from './dao/static.dao';
import { W3SModule } from '@/shared/w3s/w3s.module';
import { S3Module } from '@/shared/s3/s3.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: StaticFile.name, schema: StaticFileSchema }]),
    LogModule,
    W3SModule,
    S3Module
  ],
  controllers: [StaticController],
  providers: [StaticService, StaticFileDAO],
  exports: [StaticService]
})
export class StaticModule { }
