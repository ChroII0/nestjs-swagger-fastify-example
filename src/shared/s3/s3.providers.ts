import { ConfigService } from '@nestjs/config';
import { Config } from '@/common/enum/config';
import { LogService } from '@/shared/log/log.service';
import { S3Client } from '@aws-sdk/client-s3';

export const s3Providers = [
    {
        provide: 'S3',
        inject: [ConfigService, LogService],
        useFactory: (configService: ConfigService, logService: LogService) => {

            const accessKeyId = configService.get<string>(Config.AWS_ACCESS_KEY_ID);
            const secretAccessKey = configService.get<string>(Config.AWS_SECRET_ACCESS_KEY);
            const region = configService.get<string>(Config.AWS_REGION);

            if (!accessKeyId) {
                const errorMsg = `S3 access key id not found in configuration.`;
                logService.error(errorMsg);
                throw new Error(errorMsg);
            }
            if (!secretAccessKey) {
                const errorMsg = `S3 secret access key not found in configuration.`;
                logService.error(errorMsg);
                throw new Error(errorMsg);
            }
            if (!region) {
                const errorMsg = `S3 region not found in configuration.`;
                logService.error(errorMsg);
                throw new Error(errorMsg);
            }

            return new S3Client({
                credentials: {
                    accessKeyId,
                    secretAccessKey
                },
                region
            });
        },
    },
];
