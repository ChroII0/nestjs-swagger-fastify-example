# Nestjs-swagger-fastify-example

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A simple NestJS backend demo repository showcasing how to set up Swagger with Fastify, upload images to AWS S3 and Web3 Storage, and fix the ES Module `require()` issue in a NestJS application.

## Installation

```bash
$ yarn
```

## Environment Variables

Before running the application, make sure to configure your environment variables. You can create a `.env` file in the root of your project and populate it with the following variables. You can use the provided `.env.development` file as a template.

### Example `.env` Configuration

```plaintext
##########################################################
# MONGODB CONFIG
##########################################################
MONGODB_URI=

##########################################################
# W3S CONFIG
##########################################################
W3S_KEY=
W3S_GATEWAY_URL=https://w3s.link/ipfs/

##########################################################
# AWS CONFIG
##########################################################
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=

##########################################################
# LOG4JS CONFIG
##########################################################
LOG_DIR=./logs

##########################################################
# CORS CONFIG
##########################################################
CORS_ORIGIN_LIST=http://localhost:3000,http://localhost:3001

##########################################################
# FILE CONFIG
##########################################################
UPLOAD_FILE_SIZE_LIMIT=10485760 # 1024 * 1024 * 10
```

Make sure to fill in the values for each variable according to your environment setup.

**Note:** 
- If you want to upload to Web3 Storage, you need to include `W3S_KEY` in your `.env` file and ensure that the file `w3s.proof` is located in the root directory.

- If you do not need to use the S3 module or the W3S module, you can delete the `s3` and `w3s` directories in the `shared` folder and update the files as follows:

### Updated `static.module.ts`
```ts
import { Global, Module } from '@nestjs/common';
import { LogModule } from '@/shared/log/log.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticController } from './static.controller';
import { StaticFile, StaticFileSchema } from './dao/static.entity';
import { StaticService } from './static.service';
import { StaticFileDAO } from './dao/static.dao';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: StaticFile.name, schema: StaticFileSchema }]),
    LogModule,
  ],
  controllers: [StaticController],
  providers: [StaticService, StaticFileDAO],
  exports: [StaticService]
})
export class StaticModule { }
```

### Updated `static.service.ts`
```ts
import { Injectable } from '@nestjs/common';
import { StaticFileDAO } from './dao/static.dao';
import { FileUploadResponseDto } from '@/common/dto/file-upload-response.dto';

@Injectable()
export class StaticService {

    constructor(
        private readonly staticFileDAO: StaticFileDAO
    ) { }

    async uploadFile(
        fileToBuffer: Buffer,
        fileName: string,
        fileMimeType: string
    ): Promise<FileUploadResponseDto> {
        
        const w3sCid = "example w3sCid";

        const s3Url = "example s3Url"

        await this.staticFileDAO.updateAndSave({ s3Url, w3sCid }, {
            s3Url,
            w3sCid,
            createdAt: new Date(),
            updateAt: new Date()
        });

        return {
            ipfs: {
                baseUrl: "example baseUrl",
                cid: w3sCid
            },
            s3Url
        }
    }
}
```

## Running the app

```bash
# development
$ yarn start
```
After running the app, open your browser and navigate to http://localhost:8080/docs to view the Swagger documentation.

## License

[MIT licensed](LICENSE).
