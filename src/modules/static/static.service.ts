import { Injectable } from '@nestjs/common';
import { W3SService } from '@/shared/w3s/w3s.service';
import { S3Service } from '@/shared/s3/s3.service';
import { StaticFileDAO } from './dao/static.dao';
import { FileUploadResponseDto } from '@/common/dto/file-upload-response.dto';

@Injectable()
export class StaticService {

    constructor(
        private readonly w3sService: W3SService,
        private readonly s3Service: S3Service,
        private readonly staticFileDAO: StaticFileDAO
    ) { }

    async uploadFile(
        fileToBuffer: Buffer,
        fileName: string,
        fileMimeType: string
    ): Promise<FileUploadResponseDto> {
        
        const w3sCid = await this.w3sService.uploadFile(new File([fileToBuffer], fileName));

        const s3Url = await this.s3Service.uploadFile(
            w3sCid,
            fileMimeType,
            fileToBuffer,
            fileName
        );

        await this.staticFileDAO.updateAndSave({ s3Url, w3sCid }, {
            s3Url,
            w3sCid,
            createdAt: new Date(),
            updateAt: new Date()
        });

        return {
            ipfs: {
                baseUrl: this.w3sService.W3S_GATEWAY_URL,
                cid: w3sCid
            },
            s3Url
        }
    }
}
