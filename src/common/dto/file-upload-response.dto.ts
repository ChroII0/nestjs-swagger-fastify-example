import { ApiProperty } from "@nestjs/swagger";

class IPFSResponseDto {

    @ApiProperty()
    baseUrl: string;
    
    @ApiProperty()
    cid: string;
}

export class FileUploadResponseDto {

    @ApiProperty()
    ipfs: IPFSResponseDto;

    @ApiProperty()
    s3Url: string;
}
