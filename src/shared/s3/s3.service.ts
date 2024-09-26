import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { LogService } from '@/shared/log/log.service';
import { ConfigService } from '@nestjs/config';
import { Config } from '@/common/enum/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getFileExtension } from '@/common/utils/get-file-extension';

@Injectable()
export class S3Service {

    public readonly AWS_REGION: string;
    public readonly S3_BUCKET_NAME: string;

    constructor(
        private readonly logService: LogService,
        private readonly configService: ConfigService,
        @Inject('S3') private s3Client: S3Client
    ) {
        this.AWS_REGION = this.configService.get<string>(Config.AWS_REGION);
        this.S3_BUCKET_NAME = this.configService.get<string>(Config.S3_BUCKET_NAME);
        if (!this.AWS_REGION) {
            const errorMsg = `AWS_REGION not found in configuration.`;
            logService.error(errorMsg);
            throw new Error(errorMsg);
        }
        if (!this.S3_BUCKET_NAME) {
            const errorMsg = `S3_BUCKET_NAME not found in configuration.`;
            logService.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    async uploadFile(
        key: string,
        contentType: string,
        body: Buffer,
        filename: string
    ): Promise<string> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.S3_BUCKET_NAME,
                    Key: key,
                    ContentType: contentType,
                    Body: body,
                    Metadata: { Ext: getFileExtension(filename) },
                    ServerSideEncryption: 'AES256',
                })
            );
            return this.makeS3UrlByKey(key);
        } catch (error) {
            this.logService.error(error);
            throw new BadGatewayException('Failed to upload file to S3', error);
        }
    }

    private makeS3UrlByKey(key: string): string {
        return `https://${this.S3_BUCKET_NAME}.s3.${this.AWS_REGION}.amazonaws.com/${key}`;
    }
}
