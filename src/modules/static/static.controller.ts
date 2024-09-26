import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { StaticService } from './static.service';
import { FileUploadDto } from '@/common/dto/file-upload.dto';
import { FileUploadResponseDto } from '@/common/dto/file-upload-response.dto';

@Controller('/static')
export class StaticController {
  constructor(private readonly staticService: StaticService) { }

  @Post('/upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiCreatedResponse({ type: FileUploadResponseDto })
  @ApiOperation({ summary: "Upload file to S3 and Web3 Storage." })
  async updateImage(@Body() body): Promise<FileUploadResponseDto> {
    const image = body.image || body;
    
    const filename = image.filename;
    const mimetype = image.mimetype;
    const file = image.file;
    const fileToBuffer = await image.toBuffer(file);
    
    return await this.staticService.uploadFile(
      fileToBuffer,
      filename,
      mimetype
    );
  }
}
