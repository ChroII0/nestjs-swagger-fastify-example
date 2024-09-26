import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { LogService } from '@/shared/log/log.service';
import { ConfigService } from '@nestjs/config';
import { Config } from '@/common/enum/config';

@Injectable()
export class W3SService {

  public readonly W3S_GATEWAY_URL: string;

  constructor(
    private readonly logService: LogService,
    private readonly configService: ConfigService,
    @Inject('WEB3_STORAGE') private w3sClient: any
  ) {
    this.W3S_GATEWAY_URL = this.configService.get<string>(Config.W3S_GATEWAY_URL);
    if (!this.W3S_GATEWAY_URL) {
      const errorMsg = `W3S_GATEWAY_URL not found in configuration.`;
      logService.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const w3sCid = await this.w3sClient.uploadFile(file);
      return w3sCid.toString();
    } catch (error) {
      this.logService.error(error);
      throw new BadGatewayException('Failed to upload file to W3S', error);
    }
  }
}
