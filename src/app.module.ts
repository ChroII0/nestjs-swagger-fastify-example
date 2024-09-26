import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './common/enum/config';
import { StaticModule } from './modules/static/static.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(Config.MONGODB_URI),
      }),
    }),
    StaticModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
